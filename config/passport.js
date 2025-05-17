const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
require('dotenv').config();


const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

// JWT strategy for authenticating protected routes
passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      // Find the user based on the JWT payload
      const user = await User.findById(jwt_payload.id);

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      console.error('Error in JWT Strategy:', error);
      return done(error, false);
    }
  })
);

module.exports = passport;