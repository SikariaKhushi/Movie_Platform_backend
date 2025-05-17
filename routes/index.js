const express = require('express');
const authRoutes = require('./authRoutes');
const movieRoutes = require('./movieRoutes');
const reviewRoutes = require('./reviewRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Mount routes
router.use('/', authRoutes);
router.use('/movies', movieRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRoutes);

// Protected test route
router.get('/test', protect, (req, res) => {
  res.json({ success: true, message: 'Auth works!', user: req.user });
});

module.exports = router;