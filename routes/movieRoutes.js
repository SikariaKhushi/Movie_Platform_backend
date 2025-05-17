const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const movieController = require('../controllers/movieController');

// Protect all routes
router.use(protect);

// Get upcoming movies
router.get('/upcoming', movieController.getUpcomingMovies);

// Get latest movie
router.get('/latest', movieController.getLatestMovie);

// Get popular movies
router.get('/popular', movieController.getPopularMovies);

// Get top rated movies
router.get('/top_rated', movieController.getTopRatedMovies);

// Search movies
router.get('/search', movieController.searchMovies);

// Get similar movies
router.get('/:id/similar', movieController.getSimilarMovies);

// Get movie details
router.get('/:id', movieController.getMovieDetails);

module.exports = router;