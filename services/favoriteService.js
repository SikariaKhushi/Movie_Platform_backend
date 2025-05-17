const Favorite = require('../models/Favorite');
const movieService = require('./movieService');
const { ApiError } = require('../utils/apiError');

/**
 * Favorite service
 */
const favoriteService = {
  /**
   * Add a movie to favorites
   * @param {String} movieId - Movie ID
   * @param {Object} user - Current user
   * @returns {Object} Created favorite
   */
  addFavorite: async (movieId, user) => {
    // Check if movie already in favorites
    const existingFavorite = await Favorite.findOne({ 
      movieId, 
      userId: user._id 
    });
    
    if (existingFavorite) {
      throw new ApiError('Movie already in favorites', 400);
    }

    // Get movie details from TMDB API
    const movieDetails = await movieService.getMovieDetails(movieId);

    // Create new favorite with basic movie data
    const favorite = await Favorite.create({
      movieId,
      userId: user._id,
      movieData: {
        title: movieDetails.title,
        poster_path: movieDetails.poster_path,
        release_date: movieDetails.release_date,
        overview: movieDetails.overview
      }
    });

    return favorite;
  },

  /**
   * Get user favorites
   * @param {Object} user - Current user
   * @returns {Array} User favorites
   */
  getUserFavorites: async (user) => {
    const favorites = await Favorite.find({ userId: user._id })
      .sort({ createdAt: -1 });

    return favorites;
  },

  /**
   * Remove a movie from favorites
   * @param {String} favoriteId - Favorite ID
   * @param {Object} user - Current user
   * @returns {Boolean} Success status
   */
  removeFavorite: async (favoriteId, user) => {
    const favorite = await Favorite.findById(favoriteId);

    // Check if favorite exists
    if (!favorite) {
      throw new ApiError('Favorite not found', 404);
    }

    // Check if user is the owner of the favorite
    if (favorite.userId.toString() !== user._id.toString()) {
      throw new ApiError('Not authorized to remove this favorite', 403);
    }

    await favorite.deleteOne();
    return true;
  }
};

module.exports = favoriteService;