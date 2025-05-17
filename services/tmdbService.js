const tmdbApi = require('../utils/tmdb');
const { ApiError } = require('../utils/apiError');
const cacheService = require('./cacheService');

/**
 * Service for handling TMDB API related operations
 */
const tmdbService = {
  /**
   * Get upcoming movies from TMDB
   * @param {Number} page - Page number for pagination
   * @returns {Promise<Object>} - Promise with upcoming movies data
   */
  getUpcomingMovies: async (page = 1) => {
    try {
      const cacheKey = `upcoming_movies_${page}`;
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const upcomingMovies = await tmdbApi.getUpcoming(page);
      
      // Cache the data for 1 hour
      await cacheService.set(cacheKey, JSON.stringify(upcomingMovies), 3600);
      
      return upcomingMovies;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw new ApiError('Failed to fetch upcoming movies', 500);
    }
  },
  
  /**
   * Get latest movie from TMDB
   * @returns {Promise<Object>} - Promise with latest movie data
   */
  getLatestMovie: async () => {
    try {
      const cacheKey = 'latest_movie';
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const latestMovie = await tmdbApi.getLatest();
      
      // Cache the data for 6 hours (latest doesn't change often)
      await cacheService.set(cacheKey, JSON.stringify(latestMovie), 21600);
      
      return latestMovie;
    } catch (error) {
      console.error('Error fetching latest movie:', error);
      throw new ApiError('Failed to fetch latest movie', 500);
    }
  },
  
  /**
   * Get popular movies from TMDB
   * @param {Number} page - Page number for pagination
   * @returns {Promise<Object>} - Promise with popular movies data
   */
  getPopularMovies: async (page = 1) => {
    try {
      const cacheKey = `popular_movies_${page}`;
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const popularMovies = await tmdbApi.getPopular(page);
      
      // Cache the data for 3 hours
      await cacheService.set(cacheKey, JSON.stringify(popularMovies), 10800);
      
      return popularMovies;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw new ApiError('Failed to fetch popular movies', 500);
    }
  },
  
  /**
   * Get top rated movies from TMDB
   * @param {Number} page - Page number for pagination
   * @returns {Promise<Object>} - Promise with top rated movies data
   */
  getTopRatedMovies: async (page = 1) => {
    try {
      const cacheKey = `top_rated_movies_${page}`;
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const topRatedMovies = await tmdbApi.getTopRated(page);
      
      // Cache the data for 4 hours
      await cacheService.set(cacheKey, JSON.stringify(topRatedMovies), 14400);
      
      return topRatedMovies;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw new ApiError('Failed to fetch top rated movies', 500);
    }
  },
  
  /**
   * Search movies from TMDB
   * @param {String} query - Search query
   * @param {Number} page - Page number for pagination
   * @returns {Promise<Object>} - Promise with search results
   */
  searchMovies: async (query, page = 1) => {
    try {
      const cacheKey = `search_movies_${query}_${page}`;
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const searchResults = await tmdbApi.searchMovies(query, page);
      
      // Cache the data for 1 hour
      await cacheService.set(cacheKey, JSON.stringify(searchResults), 3600);
      
      return searchResults;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new ApiError('Failed to search movies', 500);
    }
  },
  
  /**
   * Get movie details by ID from TMDB
   * @param {String} id - Movie ID
   * @returns {Promise<Object>} - Promise with movie details
   */
  getMovieById: async (id) => {
    try {
      const cacheKey = `movie_details_${id}`;
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const movieDetails = await tmdbApi.getMovieDetails(id);
      
      // Cache the data for 24 hours (movie details don't change often)
      await cacheService.set(cacheKey, JSON.stringify(movieDetails), 86400);
      
      return movieDetails;
    } catch (error) {
      // Handle 404 specially
      if (error.response && error.response.status === 404) {
        return null;
      }
      
      console.error('Error fetching movie details:', error);
      throw new ApiError('Failed to fetch movie details', 500);
    }
  },
  
  /**
   * Get similar movies by ID from TMDB
   * @param {String} id - Movie ID
   * @param {Number} page - Page number for pagination
   * @returns {Promise<Object>} - Promise with similar movies
   */
  getSimilarMovies: async (id, page = 1) => {
    try {
      const cacheKey = `similar_movies_${id}_${page}`;
      const cachedData = await cacheService.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const similarMovies = await tmdbApi.getSimilarMovies(id, page);
      
      // Cache the data for 6 hours
      await cacheService.set(cacheKey, JSON.stringify(similarMovies), 21600);
      
      return similarMovies;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      throw new ApiError('Failed to fetch similar movies', 500);
    }
  },
  
  /**
   * Format movie data for response
   * @param {Object} movie - Raw movie data from TMDB
   * @param {Boolean} isDetailed - Whether to include detailed information
   * @returns {Object} - Formatted movie data
   */
  formatMovieData: (movie, isDetailed = false) => {
    if (!movie) return null;
    
    const baseData = {
      id: movie.id,
      title: movie.title,
      poster_path: tmdbApi.getImageUrl(movie.poster_path),
      overview: movie.overview
    };
    
    if (movie.genres) {
      baseData.genres = movie.genres;
    } else if (movie.genre_ids) {
      baseData.genre_ids = movie.genre_ids;
    }
    
    if (movie.release_date) {
      baseData.release_date = movie.release_date;
    }
    
    if (movie.vote_average !== undefined) {
      baseData.vote_average = movie.vote_average;
    }
    
    if (movie.vote_count !== undefined) {
      baseData.vote_count = movie.vote_count;
    }
    
    if (movie.popularity !== undefined) {
      baseData.popularity = movie.popularity;
    }
    
    // Add detailed information if requested
    if (isDetailed) {
      baseData.backdrop_path = tmdbApi.getImageUrl(movie.backdrop_path, 'original');
      baseData.poster_path = tmdbApi.getImageUrl(movie.poster_path, 'original');
      
      if (movie.budget !== undefined) baseData.budget = movie.budget;
      if (movie.revenue !== undefined) baseData.revenue = movie.revenue;
      if (movie.runtime !== undefined) baseData.runtime = movie.runtime;
      if (movie.original_language) baseData.original_language = movie.original_language;
      if (movie.production_countries) baseData.production_countries = movie.production_countries;
      if (movie.production_companies) baseData.production_companies = movie.production_companies;
      if (movie.homepage) baseData.homepage = movie.homepage;
      if (movie.status) baseData.status = movie.status;
      if (movie.tagline) baseData.tagline = movie.tagline;
    }
    
    return baseData;
  },
  
  /**
   * Format a list of movies for response
   * @param {Array} movies - List of raw movie data from TMDB
   * @param {String} type - Type of movie list for specific formatting
   * @returns {Array} - Formatted movie list
   */
  formatMovieList: (movies, type = 'default') => {
    if (!movies || !Array.isArray(movies)) return [];
    
    return movies.map(movie => {
      const formattedMovie = tmdbService.formatMovieData(movie);
      
      // Add type-specific fields
      switch (type) {
        case 'upcoming':
          // release_date already added in formatMovieData
          break;
        case 'popular':
          // popularity already added in formatMovieData
          break;
        case 'top_rated':
          // vote_count and vote_average already added in formatMovieData
          break;
      }
      
      return formattedMovie;
    });
  }
};

module.exports = tmdbService;