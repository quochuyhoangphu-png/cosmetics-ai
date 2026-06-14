/**
 * Global Error Handler Middleware - Middleware xử lý lỗi toàn cục
 * Catches all unhandled errors and returns structured JSON responses
 */

/**
 * Error handler middleware
 * @param {Error} err - The error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
function errorHandler(err, req, res, next) {
  // Log the error for debugging
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Multer errors (file upload) - Lỗi tải file
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'File size exceeds the 10MB limit. File quá lớn (tối đa 10MB).',
      },
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'UNEXPECTED_FILE',
        message: 'Unexpected file field. Trường file không đúng.',
      },
    });
  }

  if (err.message && err.message.includes('Only PDF files')) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: err.message,
      },
    });
  }

  // Sequelize validation errors - Lỗi validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    const details = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Data validation failed. Dữ liệu không hợp lệ.',
        details,
      },
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this data already exists. Dữ liệu đã tồn tại.',
      },
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database error occurred. Lỗi cơ sở dữ liệu.',
      },
    });
  }

  // Default server error - Lỗi server mặc định
  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development'
        ? err.message
        : 'An internal server error occurred. Lỗi server nội bộ.',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

/**
 * 404 Not Found handler - Xử lý đường dẫn không tìm thấy
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found. Đường dẫn không tìm thấy.`,
    },
  });
}

module.exports = { errorHandler, notFoundHandler };
