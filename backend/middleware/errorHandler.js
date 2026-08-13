/**
 * errorHandler.js
 * ─────────────────────────────────────────────────────────
 * Unified error-handling middleware (must be last in chain).
 * Catches all errors thrown/passed via next(err) and returns
 * a consistent JSON structure to the client.
 *
 * Response shape:
 * {
 *   "success": false,
 *   "error": {
 *     "code":    "PAYMENT_FAILED",
 *     "message": "Human-readable message",
 *     "details": { ... } // only in development
 *   }
 * }
 */

const config = require('../config');

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code       = code;
    this.details    = details;
    this.isOperational = true;
  }
}

// ── Map of well-known error codes with HTTP status ────────
const ERROR_MAP = {
  VALIDATION_ERROR:       400,
  BAD_REQUEST:            400,
  UNAUTHORIZED:           401,
  FORBIDDEN:              403,
  NOT_FOUND:              404,
  RATE_LIMIT_EXCEEDED:    429,
  PAYMENT_FAILED:         402,
  SIGNATURE_MISMATCH:     400,
  SHIPROCKET_ERROR:       502,
  RAZORPAY_ERROR:         502,
  INTERNAL_ERROR:         500,
};

/**
 * errorHandler — Express error middleware (4 args required)
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const isDev = config.nodeEnv === 'development';

  // Determine status code
  const statusCode = err.statusCode
    || ERROR_MAP[err.code]
    || 500;

  // Determine error code
  const code = err.code || 'INTERNAL_ERROR';

  // Log server errors in full
  if (statusCode >= 500) {
    console.error('\n❌ [Error Handler]', {
      code,
      message: err.message,
      stack:   err.stack,
      url:     req.originalUrl,
      method:  req.method,
      body:    req.body,
    });
  }

  const response = {
    success: false,
    error: {
      code,
      message: err.message || 'An unexpected error occurred.',
    },
  };

  // Only expose stack trace / raw details in development
  if (isDev && err.details) {
    response.error.details = err.details;
  }
  if (isDev && err.stack && !err.isOperational) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * notFoundHandler — catches all unmatched routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code:    'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found.`,
    },
  });
}

module.exports = { errorHandler, notFoundHandler, AppError };
