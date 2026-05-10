import CourseService from '../../services/CourseService.js';
import adminDashboardService from '../../services/adminDashboardService.js';
import { mongooseToObject, mongooseArrayToObject } from '../../utils/mongoose.js';
import logger from '../../utils/logger.js';

class AdminCoursesController {
    /**
     * [GET] /admin/courses
     */
    async index(req, res, next) {
        try {
            const { search = '', level = '', status = '', sort = 'newest' } = req.query;

            const [courses, deletedCount] = await Promise.all([
                CourseService.getFilteredCourses({ search, level, status, sort }),
                CourseService.getDeletedCoursesCount(),
            ]);

            res.render('admin/courses/index', {
                layout: 'admin',
                pageTitle: 'Manage Courses',
                courses,
                deletedCount,
                filters: { search, level, status, sort },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * [GET] /admin/courses/create
     */
    create(req, res) {
        res.render('admin/courses/create', {
            layout: 'admin',
            pageTitle: 'Add Course',
        });
    }

    /**
     * [POST] /admin/courses/store
     */
    async store(req, res, next) {
        try {
            logger.debug('Admin: creating new course', { data: req.body });

            const course = await CourseService.createCourse(req.body);

            await adminDashboardService.logActivity({
                actor: req.session.user.name,
                action: 'created',
                target: course.name,
                targetType: 'course',
                description: `${req.session.user.name} created course "${course.name}"`,
                icon: 'fas fa-plus-circle',
                iconColor: 'success',
            });

            req.flash('success', `Course "${course.name}" created successfully`);
            res.redirect('/admin/courses');
        } catch (error) {
            logger.error('Admin: error creating course', { error: error.message });
            // Re-render form with error message and preserved input — do NOT call next(error)
            res.render('admin/courses/create', {
                layout: 'admin',
                pageTitle: 'Add Course',
                formError: error.message || 'Failed to create course. Please check your input.',
                oldInput: req.body,
            });
        }
    }

    /**
     * [GET] /admin/courses/trash
     */
    async trash(req, res, next) {
        try {
            const deletedCourses = await CourseService.getDeletedCourses();
            res.render('admin/courses/trash', {
                layout: 'admin',
                pageTitle: 'Trash',
                courses: mongooseArrayToObject(deletedCourses),
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * [GET] /admin/courses/:id/edit
     */
    async edit(req, res, next) {
        try {
            const course = await CourseService.getCourseById(req.params.id);
            res.render('admin/courses/edit', {
                layout: 'admin',
                pageTitle: 'Edit Course',
                course: mongooseToObject(course),
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * [PUT] /admin/courses/:id
     */
    async update(req, res, next) {
        try {
            logger.debug('Admin: updating course', { id: req.params.id });

            const course = await CourseService.updateCourse(req.params.id, req.body);

            await adminDashboardService.logActivity({
                actor: req.session.user.name,
                action: 'updated',
                target: course.name,
                targetType: 'course',
                description: `${req.session.user.name} updated course "${course.name}"`,
                icon: 'fas fa-pen',
                iconColor: 'warning',
            });

            req.flash('success', `Course "${course.name}" updated successfully`);
            res.redirect('/admin/courses');
        } catch (error) {
            logger.error('Admin: error updating course', { error: error.message });
            // Re-render edit form with error and preserved input
            try {
                const course = await CourseService.getCourseById(req.params.id);
                res.render('admin/courses/edit', {
                    layout: 'admin',
                    pageTitle: 'Edit Course',
                    course: mongooseToObject(course),
                    formError: error.message || 'Failed to update course. Please check your input.',
                    oldInput: req.body,
                });
            } catch (fetchError) {
                next(fetchError);
            }
        }
    }

    /**
     * [DELETE] /admin/courses/:id
     */
    async delete(req, res, next) {
        try {
            logger.debug('Admin: soft deleting course', { id: req.params.id });
            await CourseService.deleteCourse(req.params.id);

            await adminDashboardService.logActivity({
                actor: req.session.user.name,
                action: 'deleted',
                targetType: 'course',
                description: `${req.session.user.name} moved a course to trash`,
                icon: 'fas fa-trash',
                iconColor: 'danger',
            });

            req.flash('success', 'Course moved to trash');
            res.redirect('/admin/courses');
        } catch (error) {
            next(error);
        }
    }

    /**
     * [PATCH] /admin/courses/:id/restore
     */
    async restore(req, res, next) {
        try {
            logger.debug('Admin: restoring course', { id: req.params.id });
            await CourseService.restoreCourse(req.params.id);

            await adminDashboardService.logActivity({
                actor: req.session.user.name,
                action: 'restored',
                targetType: 'course',
                description: `${req.session.user.name} restored a course from trash`,
                icon: 'fas fa-rotate-left',
                iconColor: 'info',
            });

            req.flash('success', 'Course restored successfully');
            res.redirect('/admin/courses/trash');
        } catch (error) {
            next(error);
        }
    }

    /**
     * [DELETE] /admin/courses/:id/force
     */
    async forceDelete(req, res, next) {
        try {
            logger.debug('Admin: force deleting course', { id: req.params.id });
            await CourseService.forceDeleteCourse(req.params.id);

            await adminDashboardService.logActivity({
                actor: req.session.user.name,
                action: 'force_deleted',
                targetType: 'course',
                description: `${req.session.user.name} permanently deleted a course`,
                icon: 'fas fa-bomb',
                iconColor: 'danger',
            });

            req.flash('success', 'Course permanently deleted');
            res.redirect('/admin/courses/trash');
        } catch (error) {
            next(error);
        }
    }

    /**
     * [POST] /admin/courses/handle-form-actions
     */
    async handleFormActions(req, res, next) {
        try {
            const { action, coursesIds } = req.body;
            const ids = Array.isArray(coursesIds) ? coursesIds : [coursesIds].filter(Boolean);

            logger.debug('Admin: bulk action', { action, count: ids.length });

            switch (action) {
                case 'delete':
                    await CourseService.bulkDeleteCourses(ids);
                    req.flash('success', `${ids.length} course(s) moved to trash`);
                    res.redirect('/admin/courses');
                    break;
                default:
                    throw new Error(`Invalid action: ${action}`);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminCoursesController();
