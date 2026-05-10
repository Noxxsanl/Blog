import logger from '../utils/logger.js';

/**
 * Middleware: require authenticated session
 * Redirects to /login and saves the intended URL in session
 */
export const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        logger.debug('Unauthenticated access attempt', { path: req.originalUrl });
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
};
