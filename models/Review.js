const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: [true, 'Please add a movie ID'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: [true, 'Please add an author name']
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  content: {
    type: String,
    required: [true, 'Please add review content'],
    maxlength: [1000, 'Review cannot be more than 1000 characters']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, 'Please add a rating between 0-5']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for movie-user combination to ensure one review per movie per user
ReviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);