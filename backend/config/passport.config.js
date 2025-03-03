const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const User = require('../models/user.models');
const { verifyCallbackFunction } = require('../controllers/auth.controllers');

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}; 
passport.use(new Strategy(AUTH_OPTIONS, verifyCallbackFunction));

passport.serializeUser((user, done) => {
    done(null, user.id); // Store user ID in the session
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    }).catch(err => {
        console.error('Error deserializing user', err);
        done(err, null);
    });
});
