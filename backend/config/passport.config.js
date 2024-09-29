const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/user.models');
const { verifyCallbackFunction } = require('../controllers/auth.controllers');

const AUTH_OPTIONS = {
    callbackURL: 'https://jbb-fullstack.onrender.com/auth/google/callback',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
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
