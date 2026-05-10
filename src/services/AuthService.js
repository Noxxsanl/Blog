import User from '../app/models/User.js';
import ApiError from '../common/ApiError.js';
import { HTTP_STATUS, AUTH_MESSAGES } from '../config/constants/index.js';
import logger from '../utils/logger.js';

class AuthService {
    async findUserByEmail(email) {
        try {
            logger.debug('Finding user by email', { email });
            return await User.findOne({ email: email.toLowerCase().trim() });
        } catch (error) {
            logger.error('Error finding user by email', { error: error.message });
            throw error;
        }
    }

    async login(email, password) {
        try {
            logger.debug('Attempting login', { email });

            const user = await this.findUserByEmail(email);

            if (!user) {
                throw new ApiError(AUTH_MESSAGES.LOGIN_FAILED, HTTP_STATUS.UNAUTHORIZED);
            }

            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                throw new ApiError(AUTH_MESSAGES.LOGIN_FAILED, HTTP_STATUS.UNAUTHORIZED);
            }

            logger.info('User logged in successfully', { userId: user._id });
            return user;
        } catch (error) {
            logger.error('Login failed', { error: error.message });
            throw error;
        }
    }

    async register(userData) {
        try {
            logger.debug('Registering new user', { email: userData.email });

            const existing = await this.findUserByEmail(userData.email);
            if (existing) {
                throw new ApiError(AUTH_MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
            }

            const user = new User(userData);
            const saved = await user.save();

            logger.info('User registered successfully', { userId: saved._id });
            return saved;
        } catch (error) {
            logger.error('Registration failed', { error: error.message });
            throw error;
        }
    }
}

export default new AuthService();
