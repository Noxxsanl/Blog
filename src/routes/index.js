/**
 * @fileoverview Main Route Configuration
 * @description Setup and organize all application routes
 */

import newsRouter from './news.js';
import siteRouter from './site.js';
import coursesRouter from './courses.js';
import meRouter from './me.js';
import authRouter from './auth.js';

/**
 * Configure all routes for the application
 *
 * @param {object} app - Express application instance
 */
const route = (app) => {
    // Auth routes (login, logout)
    app.use('/', authRouter);

    // News routes
    app.use('/news', newsRouter);

    // User-specific routes (My Courses)
    app.use('/me', meRouter);

    // Course management routes
    app.use('/courses', coursesRouter);

    // General site routes (should be last - catches everything else)
    app.use('/', siteRouter);
};

export default route;
