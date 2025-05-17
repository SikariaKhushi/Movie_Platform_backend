const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const Favorite = require('../models/Favorite');
const favoriteService = require('../services/favoriteService');
const tmdbService = require('../services/tmdbService');

// @desc    Add movie to favorites
// @route   POST /api/favorites
// @access  Private
exports.addFavorite = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;

  if (!movieId) {
    throw new ApiError('Please provide a movie ID', 400);
  }

  // Check if movie exists in TMDB
  const movieData = await tmdbService.getMovieById(movieId);
  if (!movieData) {
    throw new ApiError('Movie not found', 404);
  }

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({ userId, movieId });
  if (existingFavorite) {
    throw new ApiError('Movie is already in favorites', 400);
  }

  // Extract basic movie data to store
  const favoriteData = {
    movieId,
    userId,
    movieData: {
      title: movieData.title,
      poster_path: movieData.poster_path,
      release_date: movieData.release_date,
      overview: movieData.overview
    }
  };

  const favorite = await Favorite.create(favoriteData);

  res.status(201).json({
    success: true,
    data: favorite
  });
});

// @desc    Get all favorites for a user
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: favorites.length,
    data: favorites
  });
});

// @desc    Remove movie from favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
exports.removeFavorite = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  const favorite = await Favorite.findOneAndDelete({ userId, movieId });

  if (!favorite) {
    throw new ApiError('Favorite not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});