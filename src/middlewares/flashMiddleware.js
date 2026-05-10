/**
 * Lightweight session-based flash message middleware.
 *
 * Usage in controllers:
 *   req.flash('success', 'Course created successfully');
 *   req.flash('error', 'Something went wrong');
 *
 * Usage in templates (via res.locals.flash):
 *   {{#if flash.success}}...{{/if}}
 *   {{#if flash.error}}...{{/if}}
 */
const flashMiddleware = (req, res, next) => {
    // Writer: store a flash for the NEXT request
    req.flash = (type, message) => {
        if (!req.session._flash) req.session._flash = {};
        req.session._flash[type] = message;
    };

    // Reader: consume flash from the CURRENT request's session and expose to views
    const flash = (req.session && req.session._flash) || {};
    if (req.session) req.session._flash = null;
    res.locals.flash = flash;

    next();
};

export default flashMiddleware;
