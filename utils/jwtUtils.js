const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - The data to encode in the token
 * @returns {String} JWT token
 */
exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Verify JWT token
 * @param {String} token - The token to verify
 * @returns {Object} Decoded token payload or error
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};