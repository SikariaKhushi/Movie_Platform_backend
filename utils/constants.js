// TMDB Image sizes
const POSTER_SIZES = {
  SMALL: 'w185',
  MEDIUM: 'w342',
  LARGE: 'w500',
  ORIGINAL: 'original'
};

// TMDB API endpoints
const TMDB_ENDPOINTS = {
  UPCOMING: '/movie/upcoming',
  LATEST: '/movie/latest',
  POPULAR: '/movie/popular',
  TOP_RATED: '/movie/top_rated',
  SEARCH: '/search/movie',
  MOVIE_DETAIL: '/movie'
};

// Redis cache keys prefix
const CACHE_KEYS = {
  UPCOMING: 'upcoming_movies_',
  LATEST: 'latest_movie',
  POPULAR: 'popular_movies_',
  TOP_RATED: 'top_rated_movies_',
  SEARCH: 'search_movies_',
  MOVIE_DETAIL: 'movie_detail_'
};

// Cache expiration times in seconds
const CACHE_EXPIRATION = {
  UPCOMING: 3600, // 1 hour
  LATEST: 3600, // 1 hour
  POPULAR: 3600, // 1 hour
  TOP_RATED: 3600, // 1 hour
  SEARCH: 1800, // 30 minutes
  MOVIE_DETAIL: 86400 // 24 hours
};

module.exports = {
  POSTER_SIZES,
  TMDB_ENDPOINTS,
  CACHE_KEYS,
  CACHE_EXPIRATION
};