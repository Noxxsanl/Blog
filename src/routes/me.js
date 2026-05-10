/**
 * @fileoverview Me (User) Routes
 * @description Define all routes for user-specific pages (My Courses)
 */

import express from 'express';
import meController from '../app/controllers/meController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * User-specific Course Management Routes
 * All routes require authentication
 */

// Display all stored (not deleted) courses
// Route: GET /me/stored/courses
router.get('/stored/courses', requireAuth, meController.storedCourses);

// Display all soft-deleted (trashed) courses
// Route: GET /me/trash/courses
router.get('/trash/courses', requireAuth, meController.trashCourses);

export default router;
