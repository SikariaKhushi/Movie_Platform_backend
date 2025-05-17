const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apiError');
const Review = require('../models/Review');
const User = require('../models/User');
const tmdbService = require('../services/tmdbService');

// @desc    Add review for a movie
// @route   POST /api/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res) => {
  const { movieId, content, rating } = req.body;
  const userId = req.user.id;

  if (!movieId || !content || rating === undefined) {
    throw new ApiError('Please provide movieId, content and rating', 400);
  }

  // Validate rating
  if (rating < 0 || rating > 5) {
    throw new ApiError('Rating must be between 0 and 5', 400);
  }

  // Check if movie exists in TMDB
  const movieExists = await tmdbService.getMovieById(movieId);
  if (!movieExists) {
    throw new ApiError('Movie not found', 404);
  }

  // Check if user already reviewed this movie
  const existingReview = await Review.findOne({ userId, movieId });
  if (existingReview) {
    throw new ApiError('You have already reviewed this movie. Please update your existing review.', 400);
  }

  // Get user data for author name
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const review = await Review.create({
    movieId,
    userId,
    authorName: user.name,
    content,
    rating,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
  });

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Get top 5 reviews for a movie
// @route   GET /api/reviews/:movieId
// @access  Private
exports.getReviewsByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  // Check if movie exists in TMDB
  const movieExists = await tmdbService.getMovieById(movieId);
  if (!movieExists) {
    throw new ApiError('Movie not found', 404);
  }

  const reviews = await Review.find({ movieId })
    .sort({ rating: -1, createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
exports.deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  // Check if user owns the review
  if (review.userId.toString() !== userId) {
    throw new ApiError('Not authorized to delete this review', 401);
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:reviewId
// @access  Private
exports.updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.id;

  // Validate inputs
  if (!content && rating === undefined) {
    throw new ApiError('Please provide content or rating to update', 400);
  }

  if (rating !== undefined && (rating < 0 || rating > 5)) {
    throw new ApiError('Rating must be between 0 and 5', 400);
  }

  let review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError('Review not found', 404);
  }

  // Check if user owns the review
  if (review.userId.toString() !== userId) {
    throw new ApiError('Not authorized to update this review', 401);
  }

  // Update fields
  if (content) review.content = content;
  if (rating !== undefined) review.rating = rating;

  await review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});