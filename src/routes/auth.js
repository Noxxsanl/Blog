import express from 'express';
import authController from '../app/controllers/AuthController.js';

const router = express.Router();

// Show login form
// Route: GET /login
router.get('/login', authController.showLogin);

// Handle login submission
// Route: POST /login
router.post('/login', authController.login);

// Handle logout
// Route: POST /logout
router.post('/logout', authController.logout);

// Show register form
// Route: GET /register
router.get('/register', authController.showRegister);

// Handle register submission
// Route: POST /register
router.post('/register', authController.register);

export default router;
