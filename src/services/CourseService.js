/**
 * @fileoverview Course Service
 * @description Business logic for course operations
 * Separates business logic from controller logic for better maintainability
 */

import Courses from '../app/models/Courses.js';
import ApiError from '../common/ApiError.js';
import { HTTP_STATUS, MESSAGES } from '../config/constants/index.js';
import logger from '../utils/logger.js';

/**
 * Course Service Class
 * Contains all business logic related to courses
 */
class CourseService {
  /**
   * Create a new course
   * 
   * @param {object} courseData - Course data from request body
   * @returns {Promise<object>} Created course document
   * @throws {ApiError} If course creation fails
   */
  async createCourse(courseData) {
    try {
      logger.debug('Creating new course', { courseData });

      const course = new Courses(courseData);
      const savedCourse = await course.save();

      logger.info('Course created successfully', { courseId: savedCourse._id });
      return savedCourse;
    } catch (error) {
      logger.error('Error creating course', { error: error.message });
      throw error;
    }
  }

  /**
   * Get course by slug
   * 
   * @param {string} slug - Course slug
   * @returns {Promise<object>} Course document or null
   * @throws {ApiError} If course not found
   */
  async getCourseBySlug(slug) {
    try {
      logger.debug('Fetching course by slug', { slug });

      const course = await Courses.findOne({ slug });

      if (!course) {
        throw new ApiError(
          MESSAGES.COURSE_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      return course;
    } catch (error) {
      logger.error('Error fetching course by slug', { error: error.message });
      throw error;
    }
  }

  /**
   * Get course by ID
   * 
   * @param {string|number} id - Course ID
   * @returns {Promise<object>} Course document or null
   * @throws {ApiError} If course not found
   */
  async getCourseById(id) {
    try {
      logger.debug('Fetching course by ID', { id });

      const course = await Courses.findById(id);

      if (!course) {
        throw new ApiError(
          MESSAGES.COURSE_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      return course;
    } catch (error) {
      logger.error('Error fetching course by ID', { error: error.message });
      throw error;
    }
  }

  /**
   * Get all courses (stored/not deleted)
   * 
   * @param {object} req - Express request object for sorting
   * @returns {Promise<array>} Array of course documents
   * @throws {Error} If fetch fails
   */
  async getAllCourses(req) {
    try {
      logger.debug('Fetching all courses');

      const courses = await Courses.find({}).sortable(req);

      return courses;
    } catch (error) {
      logger.error('Error fetching courses', { error: error.message });
      throw error;
    }
  }

  /**
   * Update course
   * 
   * @param {string|number} id - Course ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Updated course document
   * @throws {ApiError} If course not found or update fails
   */
  async updateCourse(id, updateData) {
    try {
      logger.debug('Updating course', { id, updateData });

      const course = await Courses.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true },
      );

      if (!course) {
        throw new ApiError(
          MESSAGES.COURSE_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      logger.info('Course updated successfully', { courseId: id });
      return course;
    } catch (error) {
      logger.error('Error updating course', { error: error.message });
      throw error;
    }
  }

  /**
   * Soft delete course (move to trash)
   * 
   * @param {string|number} id - Course ID
   * @returns {Promise<object>} Deleted course document
   * @throws {ApiError} If course not found
   */
  async deleteCourse(id) {
    try {
      logger.debug('Soft deleting course', { id });

      const course = await Courses.delete({ _id: id });

      if (!course) {
        throw new ApiError(
          MESSAGES.COURSE_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      logger.info('Course soft deleted', { courseId: id });
      return course;
    } catch (error) {
      logger.error('Error deleting course', { error: error.message });
      throw error;
    }
  }

  /**
   * Restore soft deleted course
   * 
   * @param {string|number} id - Course ID
   * @returns {Promise<object>} Restored course document
   * @throws {ApiError} If course not found
   */
  async restoreCourse(id) {
    try {
      logger.debug('Restoring course', { id });

      const course = await Courses.restore({ _id: id });

      if (!course) {
        throw new ApiError(
          MESSAGES.COURSE_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      logger.info('Course restored', { courseId: id });
      return course;
    } catch (error) {
      logger.error('Error restoring course', { error: error.message });
      throw error;
    }
  }

  /**
   * Permanently delete course
   * 
   * @param {string|number} id - Course ID
   * @returns {Promise<object>} Deleted course document
   * @throws {ApiError} If course not found
   */
  async forceDeleteCourse(id) {
    try {
      logger.debug('Force deleting course', { id });

      const course = await Courses.deleteOne({ _id: id });

      if (course.deletedCount === 0) {
        throw new ApiError(
          MESSAGES.COURSE_NOT_FOUND,
          HTTP_STATUS.NOT_FOUND,
        );
      }

      logger.info('Course permanently deleted', { courseId: id });
      return course;
    } catch (error) {
      logger.error('Error force deleting course', { error: error.message });
      throw error;
    }
  }

  /**
   * Get deleted courses
   * 
   * @returns {Promise<array>} Array of deleted course documents
   * @throws {Error} If fetch fails
   */
  async getDeletedCourses() {
    try {
      logger.debug('Fetching deleted courses');

      const deletedCourses = await Courses.findDeleted({});

      return deletedCourses;
    } catch (error) {
      logger.error('Error fetching deleted courses', { error: error.message });
      throw error;
    }
  }

  /**
   * Get count of deleted courses
   * 
   * @returns {Promise<number>} Count of deleted courses
   * @throws {Error} If operation fails
   */
  async getDeletedCoursesCount() {
    try {
      const count = await Courses.countDocumentsDeleted();
      return count;
    } catch (error) {
      logger.error('Error counting deleted courses', { error: error.message });
      throw error;
    }
  }

  /**
   * Get courses with optional search/filter/sort (admin use)
   *
   * @param {object} filters - { search, level, status, sort }
   * @returns {Promise<array>} Filtered course documents
   */
  async getFilteredCourses({ search = '', level = '', status = '', sort = 'newest' } = {}) {
    try {
      const query = {};
      if (search) query.name = { $regex: search, $options: 'i' };
      if (level) query.level = level;
      if (status) query.status = status;

      const sortOrder = sort === 'oldest' ? 1 : -1;
      return Courses.find(query).sort({ createdAt: sortOrder }).lean();
    } catch (error) {
      logger.error('Error fetching filtered courses', { error: error.message });
      throw error;
    }
  }

  /**
   * Bulk delete courses
   *
   * @param {array} courseIds - Array of course IDs to delete
   * @returns {Promise<object>} Result of bulk delete operation
   * @throws {Error} If operation fails
   */
  async bulkDeleteCourses(courseIds) {
    try {
      logger.debug('Bulk deleting courses', { courseIds });

      const result = await Courses.delete({ _id: { $in: courseIds } });

      logger.info('Courses bulk deleted', { count: courseIds.length });
      return result;
    } catch (error) {
      logger.error('Error bulk deleting courses', { error: error.message });
      throw error;
    }
  }
}

// Export singleton instance
export default new CourseService();
