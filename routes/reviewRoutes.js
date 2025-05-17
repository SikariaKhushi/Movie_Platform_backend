
const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Add review
router.post('/', reviewController.addReview);

// Get reviews for a movie
router.get('/:movieId', reviewController.getReviewsByMovie);

// Delete review
router.delete('/:reviewId', reviewController.deleteReview);

// Update review
router.put('/:reviewId', reviewController.updateReview);

module.exports = router;