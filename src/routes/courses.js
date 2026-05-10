import express from 'express';
import coursesController from '../app/controllers/CoursesController.js';

const router = express.Router();

// Public: course detail page
router.get('/:slug', coursesController.show);

export default router;
