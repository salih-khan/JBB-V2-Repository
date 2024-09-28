const express = require('express');
const passport = require('passport');
const { checkLoggedIn } = require('../controllers/auth.controllers');
const router = express.Router();

// Get the base URL from environment variables
const BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'; // Fallback to local for development

router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: `${BASE_URL}/failure`, // Updated to use BASE_URL
    successRedirect: `${BASE_URL}/`, // Updated to use BASE_URL
    session: true
}), (req, res) => {
    console.log("Google called us back");
});

router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(`${BASE_URL}/`); // Updated to use BASE_URL
    });
});
router.get('/secret', checkLoggedIn, (req, res) => {
    return res.send("Your personal value is 42!");
});

router.get('/failure', (req, res) => {
    res.send('Failed to login');
});

module.exports = router;