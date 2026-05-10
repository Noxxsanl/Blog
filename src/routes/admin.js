import { Router } from 'express';
import AdminDashboardController from '../app/controllers/AdminDashboardController.js';
import AdminCoursesController from '../app/controllers/AdminCoursesController.js';
import { requireAuth, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth, authorize('admin'));

// Dashboard
router.get('/dashboard', AdminDashboardController.index);

// Course management
router.get('/courses', AdminCoursesController.index);
router.get('/courses/create', AdminCoursesController.create);
router.post('/courses/store', AdminCoursesController.store);
router.post('/courses/handle-form-actions', AdminCoursesController.handleFormActions);
router.get('/courses/trash', AdminCoursesController.trash);
router.get('/courses/:id/edit', AdminCoursesController.edit);
router.put('/courses/:id', AdminCoursesController.update);
router.delete('/courses/:id', AdminCoursesController.delete);
router.patch('/courses/:id/restore', AdminCoursesController.restore);
router.delete('/courses/:id/force', AdminCoursesController.forceDelete);

export default router;
