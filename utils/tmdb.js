const axios = require('axios');
const { POSTER_SIZES, TMDB_ENDPOINTS } = require('./constants');

/**
 * TMDB API helper functions
 */
const tmdbApi = {
  /**
   * Create the base axios instance for TMDB API calls
   */
  client: axios.create({
    baseURL: process.env.TMDB_BASE_URL,
    params: {
      api_key: process.env.TMDB_API_KEY,
    },
  }),

  /**
   * Get full image URL
   * @param {String} path - Image path from TMDB
   * @param {String} size - Image size (from POSTER_SIZES)
   * @returns {String} Full image URL
   */
  getImageUrl: (path, size = POSTER_SIZES.MEDIUM) => {
    if (!path) return null;
    return `${process.env.TMDB_IMAGE_BASE_URL}${size}${path}`;
  },

  /**
   * Get upcoming movies
   * @param {Number} page - Page number for pagination
   * @returns {Promise} Promise with upcoming movies
   */
  getUpcoming: async (page = 1) => {
    const response = await tmdbApi.client.get(TMDB_ENDPOINTS.UPCOMING, {
      params: { page }
    });
    return response.data;
  },

  /**
   * Get latest movie
   * @returns {Promise} Promise with latest movie
   */
  getLatest: async () => {
    const response = await tmdbApi.client.get(TMDB_ENDPOINTS.LATEST);
    return response.data;
  },

  /**
   * Get popular movies
   * @param {Number} page - Page number for pagination
   * @returns {Promise} Promise with popular movies
   */
  getPopular: async (page = 1) => {
    const response = await tmdbApi.client.get(TMDB_ENDPOINTS.POPULAR, {
      params: { page }
    });
    return response.data;
  },

  /**
   * Get top rated movies
   * @param {Number} page - Page number for pagination
   * @returns {Promise} Promise with top rated movies
   */
  getTopRated: async (page = 1) => {
    const response = await tmdbApi.client.get(TMDB_ENDPOINTS.TOP_RATED, {
      params: { page }
    });
    return response.data;
  },

  /**
   * Search movies
   * @param {String} query - Search query
   * @param {Number} page - Page number for pagination
   * @returns {Promise} Promise with search results
   */
  searchMovies: async (query, page = 1) => {
    const response = await tmdbApi.client.get(TMDB_ENDPOINTS.SEARCH, {
      params: { query, page }
    });
    return response.data;
  },

  /**
   * Get movie details
   * @param {String} id - Movie ID
   * @returns {Promise} Promise with movie details
   */
  getMovieDetails: async (id) => {
    const response = await tmdbApi.client.get(`${TMDB_ENDPOINTS.MOVIE_DETAIL}/${id}`);
    return response.data;
  },

  /**
   * Get similar movies
   * @param {String} id - Movie ID
   * @param {Number} page - Page number for pagination
   * @returns {Promise} Promise with similar movies
   */
  getSimilarMovies: async (id, page = 1) => {
    const response = await tmdbApi.client.get(`${TMDB_ENDPOINTS.MOVIE_DETAIL}/${id}/similar`, {
      params: { page }
    });
    return response.data;
  },

  /**
   * Process movie data to include only required fields
   * @param {Object} movie - Movie data from TMDB
   * @returns {Object} Processed movie data
   */
  processMovieData: (movie) => {
    return {
      id: movie.id,
      title: movie.title,
      poster_path: tmdbApi.getImageUrl(movie.poster_path),
      backdrop_path: tmdbApi.getImageUrl(movie.backdrop_path, POSTER_SIZES.LARGE),
      genres: movie.genres || [],
      overview: movie.overview,
      release_date: movie.release_date,
      popularity: movie.popularity,
      vote_count: movie.vote_count,
      vote_average: movie.vote_average
    };
  },

  /**
   * Process movie list data to include only required fields
   * @param {Array} movies - List of movies from TMDB
   * @param {String} type - Type of movie list (upcoming, popular, top_rated)
   * @returns {Array} Processed movie list
   */
  processMovieList: (movies, type) => {
    return movies.map(movie => {
      const processedMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: tmdbApi.getImageUrl(movie.poster_path),
        genres: movie.genre_ids, // These are just IDs in lists, not full genre objects
        overview: movie.overview
      };

      // Add type-specific fields
      switch (type) {
        case 'upcoming':
          processedMovie.release_date = movie.release_date;
          break;
        case 'popular':
          processedMovie.popularity = movie.popularity;
          break;
        case 'top_rated':
          processedMovie.vote_count = movie.vote_count;
          processedMovie.vote_average = movie.vote_average;
          break;
      }

      return processedMovie;
    });
  }
};

module.exports = tmdbApi;