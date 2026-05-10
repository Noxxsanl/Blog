import AuthService from '../../services/AuthService.js';
import { loginSchema, registerSchema } from '../../validators/authValidator.js';
import logger from '../../utils/logger.js';

const ROLE_REDIRECT = {
    admin: '/admin/dashboard',
    user: '/',
};

class AuthController {
    /**
     * [GET] /login
     * Show login form
     */
    showLogin(req, res) {
        if (req.session.userId) {
            return res.redirect(ROLE_REDIRECT[req.session.user?.role] || '/');
        }
        res.render('auth/login', { layout: 'auth' });
    }

    /**
     * [POST] /login
     * Handle login form submission
     */
    async login(req, res) {
        try {
            // Validate input
            const { error, value } = loginSchema.validate(req.body, { abortEarly: false });

            if (error) {
                const errors = {};
                error.details.forEach((detail) => {
                    errors[detail.path[0]] = detail.message;
                });
                return res.render('auth/login', {
                    layout: 'auth',
                    errors,
                    oldInput: { email: req.body.email },
                });
            }

            const { email, password, remember } = value;

            const user = await AuthService.login(email, password);

            // Set session data
            req.session.userId = user._id.toString();
            req.session.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            };

            // Extend session for "remember me"
            if (remember) {
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
            }

            logger.info('User logged in', { userId: user._id, role: user.role });

            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            const defaultRedirect = ROLE_REDIRECT[user.role] || '/';
            // Only honour returnTo if it's an internal path (not external)
            const redirectTo = returnTo && returnTo.startsWith('/') ? returnTo : defaultRedirect;
            return res.redirect(redirectTo);
        } catch (error) {
            logger.error('Login error', { error: error.message });
            return res.render('auth/login', {
                layout: 'auth',
                authError: error.message,
                oldInput: { email: req.body.email },
            });
        }
    }

    /**
     * [GET] /register
     * Show register form
     */
    showRegister(req, res) {
        if (req.session.userId) {
            return res.redirect(ROLE_REDIRECT[req.session.user?.role] || '/');
        }
        res.render('auth/register', { layout: 'auth' });
    }

    /**
     * [POST] /register
     * Handle register form submission
     */
    async register(req, res) {
        try {
            const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

            if (error) {
                const errors = {};
                error.details.forEach((detail) => {
                    errors[detail.path[0]] = detail.message;
                });
                return res.render('auth/register', {
                    layout: 'auth',
                    errors,
                    oldInput: { name: req.body.name, email: req.body.email },
                });
            }

            const { name, email, password } = value;
            const user = await AuthService.register({ name, email, password });

            // Auto login after register
            req.session.userId = user._id.toString();
            req.session.user = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            };

            logger.info('User registered and logged in', { userId: user._id });
            return res.redirect('/');
        } catch (error) {
            logger.error('Register error', { error: error.message });
            return res.render('auth/register', {
                layout: 'auth',
                authError: error.message,
                oldInput: { name: req.body.name, email: req.body.email },
            });
        }
    }

    /**
     * [POST] /logout
     * Destroy session and redirect to homepage
     */
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                logger.error('Session destroy error', { error: err.message });
            }
            res.redirect('/');
        });
    }
}

export default new AuthController();
