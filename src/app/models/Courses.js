/**
 * @fileoverview Course Model
 * @description Mongoose schema and model for Course collection
 */

import mongoose from 'mongoose';
import slugify from 'slugify';
import mongooseDelete from 'mongoose-delete';
import Counter from './Counter.js';
import { COURSE_LEVELS, SLUG_CONFIG, SORT_OPTIONS } from '../../config/constants/index.js';

const Schema = mongoose.Schema;

/**
 * Course Schema Definition
 * Defines the structure and validation rules for Course documents
 */
const courseSchema = new Schema(
  {
    // Custom numeric ID for auto-increment
    _id: {
      type: Number,
    },

    // Course Name - Required
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // Course Description - Optional
    description: {
      type: String,
      trim: true,
    },

    // Course Image URL - Optional
    image: {
      type: String,
      trim: true,
    },

    // Course Level/Difficulty
    level: {
      type: String,
      enum: Object.values(COURSE_LEVELS),
      default: COURSE_LEVELS.BASIC,
    },

    // Auto-generated URL-friendly slug
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true,
    },

    // Course publication status
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  {
    // Schema options
    _id: false,
    timestamps: true, // Add createdAt and updatedAt fields
    collection: 'courses',
  },
);

/**
 * Pre-save middleware: Auto-increment numeric _id
 */
courseSchema.pre('save', async function autoIncrementId() {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      'course_id_counter',
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this._id = counter.seq;
  }
});

/**
 * Pre-save middleware: Generate unique slug before saving
 * Ensures slug is URL-friendly and unique
 */
courseSchema.pre('save', async function generateSlug() {
  // Only generate slug if name has changed or is new
  if (!this.isModified('name')) {
    return;
  }

  // Create base slug from course name
  const baseSlug = slugify(this.name, {
    lower: SLUG_CONFIG.LOWERCASE,
    strict: SLUG_CONFIG.STRICT,
  });

  // Check if slug already exists
  const Course = mongoose.models.Courses || mongoose.model('Courses', courseSchema);
  const existingCourse = await Course.findOne({
    slug: baseSlug,
    _id: { $ne: this._id }, // Exclude current document from check
  });

  // If slug is unique, use it; otherwise append random string
  if (!existingCourse) {
    this.slug = baseSlug;
  } else {
    const randomString = Math.random().toString(36).substring(2, SLUG_CONFIG.RANDOM_STRING_LENGTH + 2);
    this.slug = `${baseSlug}-${randomString}`;
  }
});

/**
 * Query helper: Sortable
 * Enables sorting of course queries based on request parameters
 * 
 * @param {object} req - Express request object containing sort parameters
 * @returns {Query} Mongoose query with sort applied
 */
courseSchema.query.sortable = function sortableQuery(req) {
  // Check if sorting is requested
  if (Object.prototype.hasOwnProperty.call(req.query, '_sort')) {
    // Validate sort type
    const isValidType = [SORT_OPTIONS.ASCENDING, SORT_OPTIONS.DESCENDING].includes(req.query.type);

    // Apply sort to query
    return this.sort({
      [req.query.column]: isValidType
        ? (req.query.type === SORT_OPTIONS.ASCENDING ? 1 : -1)
        : 0,
    });
  }

  return this;
};

/**
 * Apply Plugins
 */

// Soft delete plugin
courseSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all', // Override all Mongoose methods to respect soft delete
});

/**
 * Export Model
 * Create and export the Course model based on the schema
 */
const Courses = mongoose.model('Courses', courseSchema);

export default Courses;
