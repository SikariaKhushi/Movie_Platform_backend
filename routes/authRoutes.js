const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Register user
router.post('/signup', authController.signup);

// Login user
router.post('/login', authController.login);

// Get current user
router.get('/me', authController.getMe);

module.exports = router;