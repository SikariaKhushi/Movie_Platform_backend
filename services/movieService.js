const tmdbApi = require('../utils/tmdb');
const cacheService = require('./cacheService');
const { CACHE_EXPIRATION } = require('../utils/constants');
const { ApiError } = require('../utils/apiError');

/**
 * Movie service for handling movie-related operations
 */
const movieService = {
  /**
   * Get upcoming movies
   * @param {Number} page - Page number for pagination
   * @returns {Object} Upcoming movies with pagination
   */
  getUpcoming: async (page = 1) => {
    // Try to get from cache first
    const cacheKey = cacheService.getUpcomingKey(page);
    const cachedData = await cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from TMDB API
    try {
      const upcomingMovies = await tmdbApi.getUpcoming(page);
      
      // Process data to include only required fields
      const processed = {
        page: upcomingMovies.page,
        results: tmdbApi.processMovieList(upcomingMovies.results, 'upcoming'),
        total_pages: upcomingMovies.total_pages,
        total_results: upcomingMovies.total_results
      };
      
      // Cache the processed data
      await cacheService.set(cacheKey, processed, CACHE_EXPIRATION.UPCOMING);
      
      return processed;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw new ApiError('Failed to fetch upcoming movies', 500);
    }
  },
  
  /**
   * Get latest movie
   * @returns {Object} Latest movie
   */
  getLatest: async () => {
    // Try to get from cache first
    const cacheKey = cacheService.getLatestKey();
    const cachedData = await cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from TMDB API
    try {
      const latestMovie = await tmdbApi.getLatest();
      
      // Process data to include only required fields
      const processed = tmdbApi.processMovieData(latestMovie);
      
      // Cache the processed data
      await cacheService.set(cacheKey, processed, CACHE_EXPIRATION.LATEST);
      
      return processed;
    } catch (error) {
      console.error('Error fetching latest movie:', error);
      throw new ApiError('Failed to fetch latest movie', 500);
    }
  },
  
  /**
   * Get popular movies
   * @param {Number} page - Page number for pagination
   * @returns {Object} Popular movies with pagination
   */
  getPopular: async (page = 1) => {
    // Try to get from cache first
    const cacheKey = cacheService.getPopularKey(page);
    const cachedData = await cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from TMDB API
    try {
      const popularMovies = await tmdbApi.getPopular(page);
      
      // Process data to include only required fields
      const processed = {
        page: popularMovies.page,
        results: tmdbApi.processMovieList(popularMovies.results, 'popular'),
        total_pages: popularMovies.total_pages,
        total_results: popularMovies.total_results
      };
      
      // Cache the processed data
      await cacheService.set(cacheKey, processed, CACHE_EXPIRATION.POPULAR);
      
      return processed;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new ApiError('Failed to fetch popular movies', 500);
    }
  },
  
  /**
   * Get top rated movies
   * @param {Number} page - Page number for pagination
   * @returns {Object} Top rated movies with pagination
   */
  getTopRated: async (page = 1) => {
    // Try to get from cache first
    const cacheKey = cacheService.getTopRatedKey(page);
    const cachedData = await cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from TMDB API
    try {
      const topRatedMovies = await tmdbApi.getTopRated(page);
      
      // Process data to include only required fields
      const processed = {
        page: topRatedMovies.page,
        results: tmdbApi.processMovieList(topRatedMovies.results, 'top_rated'),
        total_pages: topRatedMovies.total_pages,
        total_results: topRatedMovies.total_results
      };
      
      // Cache the processed data
      await cacheService.set(cacheKey, processed, CACHE_EXPIRATION.TOP_RATED);
      
      return processed;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw new ApiError('Failed to fetch top rated movies', 500);
    }
  },
  
  /**
   * Search movies
   * @param {String} query - Search query
   * @param {Number} page - Page number for pagination
   * @returns {Object} Search results with pagination
   */
  searchMovies: async (query, page = 1) => {
    if (!query) {
      throw new ApiError('Search query is required', 400);
    }
    
    // Try to get from cache first
    const cacheKey = cacheService.getSearchKey(query, page);
    const cachedData = await cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from TMDB API
    try {
      const searchResults = await tmdbApi.searchMovies(query, page);
      
      // Process data to include only required fields
      const processed = {
        page: searchResults.page,
        results: tmdbApi.processMovieList(searchResults.results, 'search'),
        total_pages: searchResults.total_pages,
        total_results: searchResults.total_results
      };
      
      // Cache the processed data
      await cacheService.set(cacheKey, processed, CACHE_EXPIRATION.SEARCH);
      
      return processed;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new ApiError('Failed to search movies', 500);
    }
  },
  
  /**
   * Get movie details
   * @param {String} id - Movie ID
   * @returns {Object} Movie details
   */
  getMovieDetails: async (id) => {
    if (!id) {
      throw new ApiError('Movie ID is required', 400);
    }
    
    // Try to get from cache first
    const cacheKey = cacheService.getMovieDetailKey(id);
    const cachedData = await cacheService.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // If not in cache, fetch from TMDB API
    try {
      const movieDetails = await tmdbApi.getMovieDetails(id);
      
      // Process data to include only required fields
      const processed = tmdbApi.processMovieData(movieDetails);
      
      // Cache the processed data
      await cacheService.set(cacheKey, processed, CACHE_EXPIRATION.MOVIE_DETAIL);
      
      return processed;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${id}:`, error);
      if (error.response && error.response.status === 404) {
        throw new ApiError('Movie not found', 404);
      }
      throw new ApiError('Failed to fetch movie details', 500);
    }
  },
  
  /**
   * Get similar movies
   * @param {String} id - Movie ID
   * @param {Number} page - Page number for pagination
   * @returns {Object} Similar movies with pagination
   */
  getSimilarMovies: async (id, page = 1) => {
    if (!id) {
      throw new ApiError('Movie ID is required', 400);
    }
    
    try {
      const similarMovies = await tmdbApi.getSimilarMovies(id, page);
      
      // Process data to include only required fields
      return {
        page: similarMovies.page,
        results: tmdbApi.processMovieList(similarMovies.results, 'similar'),
        total_pages: similarMovies.total_pages,
        total_results: similarMovies.total_results
      };
    } catch (error) {
      console.error(`Error fetching similar movies for ID ${id}:`, error);
      if (error.response && error.response.status === 404) {
        throw new ApiError('Movie not found', 404);
      }
      throw new ApiError('Failed to fetch similar movies', 500);
    }
  }
};

module.exports = movieService;