const express = require('express');
const passport = require('passport');
const { checkLoggedIn } = require('../controllers/auth.controllers');
const router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true
}), (req, res) => {
    console.log("Google called us back");
});

router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/secret', checkLoggedIn, (req, res) => {
    return res.send("Your personal value is 42!");
});

router.get('/failure', (req, res) => {
    res.send('Failed to login');
});

module.exports = router;