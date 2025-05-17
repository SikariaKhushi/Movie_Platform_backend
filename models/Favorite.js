
const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: [true, 'Please add a movie ID']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // We'll store basic movie data to reduce API calls to TMDB
  movieData: {
    title: String,
    poster_path: String,
    release_date: String,
    overview: String
  }
});

// Compound index for movie-user combination to ensure no duplicate favorites
FavoriteSchema.index({ movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);