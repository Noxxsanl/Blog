import express from 'express';
import { requireAuth, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Legacy redirects — course management has moved to /admin/courses
router.get('/stored/courses', requireAuth, authorize('admin'), (req, res) => {
    res.redirect(301, '/admin/courses');
});

router.get('/trash/courses', requireAuth, authorize('admin'), (req, res) => {
    res.redirect(301, '/admin/courses/trash');
});

export default router;
