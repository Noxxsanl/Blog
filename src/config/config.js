/**
 * @fileoverview Application Configuration
 * @description Load and manage environment variables for the application
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration object
 * Contains all environment-based settings for the application
 */
const config = {
  // Application Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
  },

  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_edu',
    name: process.env.MONGODB_NAME || 'blog_edu',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'fallback_secret_change_in_production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10),
  },
};

export default config;
