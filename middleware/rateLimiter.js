const rateLimit = require('express-rate-limit');
const { ApiError } = require('../utils/apiError');

// Create rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  handler: (req, res, next, options) => {
    next(new ApiError(options.message.error, 429));
  }
});

module.exports = limiter;