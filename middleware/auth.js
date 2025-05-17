const passport = require('passport');
const { ApiError } = require('../utils/apiError');

// Require passport configuration
require('../config/passport');

/**
 * Authentication middleware using Passport JWT strategy
 * Protects routes that require authentication
 */
exports.protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(new ApiError('Authentication error', 500));
    }
    
    if (!user) {
      return next(new ApiError('Not authorized to access this route', 401));
    }
    
    // Set the user in the request object
    req.user = user;
    next();
  })(req, res, next);
};