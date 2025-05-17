const User = require('../models/User');
const { ApiError } = require('../utils/apiError');
const jwt = require('jsonwebtoken');

/**
 * Authentication service
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data (name, email, password)
   * @returns {Object} Registered user and token
   */
  register: async (userData) => {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError('Email already in use', 400);
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = user.getSignedJwtToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    };
  },

  /**
   * Login user
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Object} User and token
   */
  login: async (credentials) => {
    const { email, password } = credentials;

    // Check if email and password are provided
    if (!email || !password) {
      throw new ApiError('Please provide email and password', 400);
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Generate token
    const token = user.getSignedJwtToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    };
  }
};

module.exports = authService;