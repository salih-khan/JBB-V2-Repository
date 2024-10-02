const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/user.models');
const { verifyCallbackFunction } = require('../controllers/auth.controllers');
const dotenv = require('dotenv');

dotenv.config();

const AUTH_OPTIONS = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
};

passport.use(new GoogleStrategy(AUTH_OPTIONS, verifyCallbackFunction));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});
