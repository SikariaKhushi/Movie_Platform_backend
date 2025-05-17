const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Add movie to favorites
router.post('/', favoriteController.addFavorite);

// Get all favorites for logged in user
router.get('/', favoriteController.getFavorites);

// Remove movie from favorites
router.delete('/:movieId', favoriteController.removeFavorite);

module.exports = router;