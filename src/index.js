/**
 * @fileoverview Application Entry Point
 * @description Initialize and start the Express server
 */

import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Import configurations
import config from './config/config.js';
import { connectDB } from './config/db/index.js';
import logger from './utils/logger.js';

// Import middleware
import sortMiddleware from './middlewares/sortMiddleware.js';
import errorHandler from './middlewares/errorHandler.js';

// Import helpers
import helpers from './helpers/handlebars.js';

// Import routes
import route from './routes/index.js';

/**
 * Fix __dirname and __filename for ES Modules
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize Express app
 */
const app = express();

/**
 * Async initialization function
 */
const initializeApp = async () => {
  try {
    logger.info('Starting application...', {
      environment: config.env,
      port: config.server.port,
    });

    // Connect to MongoDB
    logger.info('Initializing database connection...');
    await connectDB();

    /**
     * MIDDLEWARE SETUP
     */

    // Static files middleware
    app.use(express.static(path.join(__dirname, 'public')));

    // Body parser middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // HTTP request logger middleware
    app.use(morgan('combined'));

    // Session middleware
    app.use(
      session({
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: config.database.uri,
          dbName: config.database.name,
          ttl: config.session.maxAge / 1000,
        }),
        cookie: {
          httpOnly: true,
          maxAge: config.session.maxAge,
          secure: config.isProduction,
        },
      }),
    );

    // Inject authenticated user into every view
    app.use((req, res, next) => {
      res.locals.currentUser = req.session.user || null;
      next();
    });

    /**
     * TEMPLATE ENGINE SETUP
     * Using Handlebars for server-side rendering
     */
    app.engine(
      'hbs',
      engine({
        extname: '.hbs',
        helpers: helpers,
      }),
    );
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'resources', 'views'));

    /**
     * REQUEST PROCESSING MIDDLEWARE
     */

    // Method override middleware (for PUT, DELETE in forms)
    app.use(methodOverride('_method'));

    // Sort middleware (make sorting info available to views)
    app.use(sortMiddleware);

    /**
     * ROUTES SETUP
     */
    route(app);

    /**
     * ERROR HANDLING MIDDLEWARE
     * Should be the last middleware
     */
    app.use(errorHandler);

    /**
     * START SERVER
     */
    app.listen(config.server.port, config.server.host, () => {
      logger.info(
        `✓ Server started successfully`,
        {
          url: `http://${config.server.host}:${config.server.port}`,
        },
      );
    });

    /**
     * GRACEFUL SHUTDOWN HANDLING
     */
    process.on('SIGTERM', () => {
      logger.warn('SIGTERM received, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      logger.warn('SIGINT received, shutting down gracefully...');
      process.exit(0);
    });

    // Global error handler
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', {
        promise,
        reason: reason instanceof Error ? reason.message : reason,
      });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', {
        error: error.message,
        stack: error.stack,
      });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to initialize application', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Start the application
initializeApp();
