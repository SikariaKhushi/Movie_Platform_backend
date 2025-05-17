const redisClient = require('../config/redis');
const { CACHE_KEYS, CACHE_EXPIRATION } = require('../utils/constants');

/**
 * Redis cache service
 */
const cacheService = {
  /**
   * Set data in Redis cache
   * @param {String} key - Cache key
   * @param {Object} data - Data to cache
   * @param {Number} expiration - Expiration time in seconds
   */
  set: async (key, data, expiration = 3600) => {
    try {
      if (!redisClient.isReady) {
        console.log('Redis not connected, skipping cache set');
        return false;
      }
      
      await redisClient.setEx(key, expiration, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  /**
   * Get data from Redis cache
   * @param {String} key - Cache key
   * @returns {Object|null} Cached data or null if not found
   */
  get: async (key) => {
    try {
      if (!redisClient.isReady) {
        console.log('Redis not connected, skipping cache get');
        return null;
      }
      
      const cachedData = await redisClient.get(key);
      if (!cachedData) return null;
      
      return JSON.parse(cachedData);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Delete data from Redis cache
   * @param {String} key - Cache key
   */
  delete: async (key) => {
    try {
      if (!redisClient.isReady) return false;
      
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  /**
   * Generate cache key for upcoming movies
   * @param {Number} page - Page number
   * @returns {String} Cache key
   */
  getUpcomingKey: (page) => `${CACHE_KEYS.UPCOMING}${page}`,

  /**
   * Generate cache key for latest movie
   * @returns {String} Cache key
   */
  getLatestKey: () => CACHE_KEYS.LATEST,

  /**
   * Generate cache key for popular movies
   * @param {Number} page - Page number
   * @returns {String} Cache key
   */
  getPopularKey: (page) => `${CACHE_KEYS.POPULAR}${page}`,

  /**
   * Generate cache key for top rated movies
   * @param {Number} page - Page number
   * @returns {String} Cache key
   */
  getTopRatedKey: (page) => `${CACHE_KEYS.TOP_RATED}${page}`,

  /**
   * Generate cache key for search results
   * @param {String} query - Search query
   * @param {Number} page - Page number
   * @returns {String} Cache key
   */
  getSearchKey: (query, page) => `${CACHE_KEYS.SEARCH}${query}_${page}`,

  /**
   * Generate cache key for movie details
   * @param {String} id - Movie ID
   * @returns {String} Cache key
   */
  getMovieDetailKey: (id) => `${CACHE_KEYS.MOVIE_DETAIL}${id}`
};

module.exports = cacheService;