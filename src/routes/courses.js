/**
 * @fileoverview Courses Routes
 * @description Define all routes related to course operations
 */

import express from 'express';
import coursesController from '../app/controllers/CoursesController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Course Management Routes
 * Follows RESTful conventions where possible
 */

// Display course creation form — requires login
// Route: GET /courses/create
router.get('/create', requireAuth, coursesController.create);

// Store newly created course — requires login
// Route: POST /courses/store
router.post('/store', requireAuth, coursesController.store);

// Handle bulk actions (delete, restore, etc.) — requires login
// Route: POST /courses/handle-form-actions
router.post('/handle-form-actions', requireAuth, coursesController.handleFormActions);

// Update course — requires login
// Route: PUT /courses/:id
router.put('/:id', requireAuth, coursesController.update);

// Soft delete course — requires login
// Route: DELETE /courses/:id
router.delete('/:id', requireAuth, coursesController.delete);

// Permanently delete course — requires login
// Route: DELETE /courses/:id/force
router.delete('/:id/force', requireAuth, coursesController.forceDelete);

// Restore soft-deleted course — requires login
// Route: PATCH /courses/:id/restore
router.patch('/:id/restore', requireAuth, coursesController.restore);

// Display course edit form — requires login
// Route: GET /courses/:id/edit
router.get('/:id/edit', requireAuth, coursesController.edit);

// Display course details by slug — public
// Route: GET /courses/:slug
// Note: Should be last as it's a catch-all for any slug
router.get('/:slug', coursesController.show);

export default router;
