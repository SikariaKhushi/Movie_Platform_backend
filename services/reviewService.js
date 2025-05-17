const Review = require('../models/Review');
const { ApiError } = require('../utils/apiError');

/**
 * Review service
 */
const reviewService = {
  /**
   * Create a new review
   * @param {Object} reviewData - Review data
   * @param {Object} user - Current user
   * @returns {Object} Created review
   */
  createReview: async (reviewData, user) => {
    const { movieId, content, rating } = reviewData;

    // Check if user has already reviewed this movie
    const existingReview = await Review.findOne({ movieId, userId: user._id });
    if (existingReview) {
      throw new ApiError('You have already reviewed this movie', 400);
    }

    // Create new review
    const review = await Review.create({
      movieId,
      userId: user._id,
      authorName: user.name,
      content,
      rating
    });

    return review;
  },

  /**
   * Get reviews for a movie
   * @param {String} movieId - Movie ID
   * @param {Number} limit - Number of reviews to return
   * @returns {Array} Movie reviews
   */
  getMovieReviews: async (movieId, limit = 5) => {
    const reviews = await Review.find({ movieId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name'); // Get user name

    return reviews;
  },

  /**
   * Delete a review
   * @param {String} reviewId - Review ID
   * @param {Object} user - Current user
   * @returns {Boolean} Success status
   */
  deleteReview: async (reviewId, user) => {
    const review = await Review.findById(reviewId);

    // Check if review exists
    if (!review) {
      throw new ApiError('Review not found', 404);
    }

    // Check if user is the author of the review
    if (review.userId.toString() !== user._id.toString()) {
      throw new ApiError('Not authorized to delete this review', 403);
    }

    await review.deleteOne();
    return true;
  }
};

module.exports = reviewService;