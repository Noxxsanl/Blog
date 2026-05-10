/**
 * @fileoverview Application Constants
 * @description Define all constant values used throughout the application
 */

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * API Response Messages
 */
export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation error',
  INVALID_ACTION: 'Action is invalid',
  COURSE_NOT_FOUND: 'Course not found',
  COURSE_CREATED: 'Course created successfully',
  COURSE_UPDATED: 'Course updated successfully',
  COURSE_DELETED: 'Course deleted successfully',
  COURSE_RESTORED: 'Course restored successfully',
};

/**
 * Course Related Constants
 */
export const COURSE_LEVELS = {
  BASIC: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao',
};

/**
 * Form Actions
 */
export const FORM_ACTIONS = {
  DELETE: 'delete',
  RESTORE: 'restore',
};

/**
 * Sort Options
 */
export const SORT_OPTIONS = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
  DEFAULT: 'default',
};

/**
 * Database Query Options
 */
export const DB_QUERY = {
  LEAN: { lean: true }, // Returns plain JavaScript objects instead of mongoose documents
};

/**
 * Slug Generation Config
 */
export const SLUG_CONFIG = {
  LOWERCASE: true,
  STRICT: true,
  RANDOM_STRING_LENGTH: 6,
};

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

/**
 * Auth Messages
 */
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  LOGIN_FAILED: 'Email hoặc mật khẩu không đúng',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  EMAIL_REQUIRED: 'Email là bắt buộc',
  EMAIL_INVALID: 'Email không đúng định dạng',
  PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản',
  USER_ALREADY_EXISTS: 'Email đã được sử dụng',
  UNAUTHORIZED: 'Vui lòng đăng nhập để tiếp tục',
};
