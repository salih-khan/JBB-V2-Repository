const express = require('express');
const passport = require('passport');
const { checkLoggedIn } = require('../controllers/auth.controllers');
const router = express.Router();

// Get the base URL from environment variables
const BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'; // Fallback to local for development
const FRONTEND_URL = 'https://jbb-fullstack.onrender.com'; // Frontend URL

router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/`, // Redirect to frontend login page on failure
    successRedirect: `${FRONTEND_URL}/`, // Redirect to frontend homepage on success
    session: true // Session management is enabled
}), (req, res) => {
    console.log("Google called us back");
    // Here, you can also send additional user information if needed
    console.log("Authenticated user:", req.user); // Log authenticated user
});

router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(`${FRONTEND_URL}/`); // Redirect to frontend after logout
    });
});

router.get('/secret', checkLoggedIn, (req, res) => {
    return res.send("Your personal value is 42!");
});

router.get('/failure', (req, res) => {
    res.send('Failed to login');
});

module.exports = router;
