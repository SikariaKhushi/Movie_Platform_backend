const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const movieService = require('../services/movieService');
const cacheService = require('../services/cacheService');
const tmdbService = require('../services/tmdbService');

// @desc    Get upcoming movies
// @route   GET /api/movies/upcoming
// @access  Private
exports.getUpcomingMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  // Try to get from cache first
  const cacheKey = `upcoming_movies_page_${page}`;
  const cachedData = await cacheService.get(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  
  const upcomingMovies = await tmdbService.getUpcomingMovies(page);
  
  // Format the response
  const response = {
    success: true,
    page: upcomingMovies.page,
    total_pages: upcomingMovies.total_pages,
    total_results: upcomingMovies.total_results,
    data: upcomingMovies.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      release_date: movie.release_date,
      genres: movie.genre_ids,
      overview: movie.overview
    }))
  };
  
  // Set cache (expire in 1 hour)
  await cacheService.set(cacheKey, JSON.stringify(response), 3600);
  
  res.status(200).json(response);
});

// @desc    Get latest movie
// @route   GET /api/movies/latest
// @access  Private
exports.getLatestMovie = asyncHandler(async (req, res) => {
  // Try to get from cache first
  const cacheKey = 'latest_movie';
  const cachedData = await cacheService.get(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  
  const latestMovie = await tmdbService.getLatestMovie();
  
  // Format the response
  const response = {
    success: true,
    data: {
      id: latestMovie.id,
      title: latestMovie.title,
      poster_path: latestMovie.poster_path ? `https://image.tmdb.org/t/p/w500${latestMovie.poster_path}` : null,
      release_date: latestMovie.release_date,
      genres: latestMovie.genres,
      overview: latestMovie.overview
    }
  };
  
  // Set cache (expire in 6 hours)
  await cacheService.set(cacheKey, JSON.stringify(response), 21600);
  
  res.status(200).json(response);
});

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Private
exports.getPopularMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  // Try to get from cache first
  const cacheKey = `popular_movies_page_${page}`;
  const cachedData = await cacheService.get(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  
  const popularMovies = await tmdbService.getPopularMovies(page);
  
  // Format the response
  const response = {
    success: true,
    page: popularMovies.page,
    total_pages: popularMovies.total_pages,
    total_results: popularMovies.total_results,
    data: popularMovies.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      popularity: movie.popularity,
      genres: movie.genre_ids,
      overview: movie.overview
    }))
  };
  
  // Set cache (expire in 3 hours)
  await cacheService.set(cacheKey, JSON.stringify(response), 10800);
  
  res.status(200).json(response);
});

// @desc    Get top rated movies
// @route   GET /api/movies/top_rated
// @access  Private
exports.getTopRatedMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  // Try to get from cache first
  const cacheKey = `top_rated_movies_page_${page}`;
  const cachedData = await cacheService.get(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  
  const topRatedMovies = await tmdbService.getTopRatedMovies(page);
  
  // Format the response
  const response = {
    success: true,
    page: topRatedMovies.page,
    total_pages: topRatedMovies.total_pages,
    total_results: topRatedMovies.total_results,
    data: topRatedMovies.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      vote_count: movie.vote_count,
      vote_average: movie.vote_average,
      genres: movie.genre_ids,
      overview: movie.overview
    }))
  };
  
  // Set cache (expire in 4 hours)
  await cacheService.set(cacheKey, JSON.stringify(response), 14400);
  
  res.status(200).json(response);
});

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Private
exports.searchMovies = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  
  if (!q) {
    throw new ApiError('Please provide a search query', 400);
  }
  
  // Try to get from cache first
  const cacheKey = `search_movies_${q}_page_${page}`;
  const cachedData = await cacheService.get(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  
  const searchResults = await tmdbService.searchMovies(q, page);
  
  // Format the response
  const response = {
    success: true,
    page: searchResults.page,
    total_pages: searchResults.total_pages,
    total_results: searchResults.total_results,
    data: searchResults.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      release_date: movie.release_date,
      genres: movie.genre_ids,
      overview: movie.overview
    }))
  };
  
  // Set cache (expire in 1 hour)
  await cacheService.set(cacheKey, JSON.stringify(response), 3600);
  
  res.status(200).json(response);
});

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Private
exports.getMovieDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Try to get from cache first
  const cacheKey = `movie_details_${id}`;
  const cachedData = await cacheService.get(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  
  const movieDetails = await tmdbService.getMovieById(id);
  
  if (!movieDetails) {
    throw new ApiError('Movie not found', 404);
  }
  
  // Format the response
  const response = {
    success: true,
    data: {
      id: movieDetails.id,
      title: movieDetails.title,
      overview: movieDetails.overview,
      genres: movieDetails.genres,
      popularity: movieDetails.popularity,
      release_date: movieDetails.release_date,
      original_language: movieDetails.original_language,
      production_countries: movieDetails.production_countries,
      vote_count: movieDetails.vote_count,
      vote_average: movieDetails.vote_average,
      budget: movieDetails.budget,
      revenue: movieDetails.revenue,
      homepage: movieDetails.homepage,
      poster_path: movieDetails.poster_path ? `https://image.tmdb.org/t/p/original${movieDetails.poster_path}` : null
    }
  };
  
  // Set cache (expire in 24 hours)
  await cacheService.set(cacheKey, JSON.stringify(response), 86400);
  
  res.status(200).json(response);
});

// @desc    Get similar movies
// @route   GET /api/movies/:id/similar
// @access  Private
exports.getSimilarMovies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  
  // Try to get from cache first
  const cacheKey = `similar_movies_${id}_page_${page}`;
  const cachedData = await cacheService.get(cacheKey);
  
  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }
  
  const similarMovies = await tmdbService.getSimilarMovies(id, page);
  
  // Format the response
  const response = {
    success: true,
    page: similarMovies.page,
    total_pages: similarMovies.total_pages,
    total_results: similarMovies.total_results,
    data: similarMovies.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      release_date: movie.release_date,
      genres: movie.genre_ids,
      overview: movie.overview
    }))
  };
  
  // Set cache (expire in 6 hours)
  await cacheService.set(cacheKey, JSON.stringify(response), 21600);
  
  res.status(200).json(response);
});