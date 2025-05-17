const { ApiError } = require('../utils/apiError');

/**
 * Custom error handler middleware
 */
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.log(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field} field`;
    error = new ApiError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ApiError(message, 400);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid token', 401);
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Token expired', 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};