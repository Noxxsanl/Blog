import CourseService from '../../services/CourseService.js';
import { mongooseToObject } from '../../utils/mongoose.js';
import logger from '../../utils/logger.js';

class CoursesController {
    /**
     * [GET] /courses/:slug
     * Public course detail page
     */
    async show(req, res, next) {
        try {
            const { slug } = req.params;
            logger.debug('Getting course by slug', { slug });
            const course = await CourseService.getCourseBySlug(slug);
            res.render('courses/show', mongooseToObject(course));
        } catch (error) {
            next(error);
        }
    }
}

export default new CoursesController();
