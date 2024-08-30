const express = require('express');
const multer = require('multer');
const { 
    getUser, 
    getAllUsers, 
    updateProfile, 
    newPost, 
    getAllPostsFromUser, 
    getAllPosts 
} = require('../controllers/user.controllers.js');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to log incoming requests
router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Route to get the current user
router.get('/api/user', getUser);

// Route to check authentication status
router.get('/api/auth/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Authenticated');
    } else {
        res.status(401).send('Not authenticated');
    }
});

// Route to create a new post
router.post('/api/newPost', upload.array('images'), newPost);

// Route to get all users
router.get('/api/getAllUsers', getAllUsers);

// Route to get all posts (current month)
router.get('/api/getAllPosts', getAllPosts);

// Route to update the user's profile
router.post('/api/updateProfile', 
    upload.fields([{ name: 'bannerImage' }, { name: 'pfp' }]), 
    (req, res, next) => {
        console.log("Inside upload middleware");
        next();
    }, 
    updateProfile
);

// Route to get all posts from a specific user
router.get('/api/getAllPostsFromUser', getAllPostsFromUser);

module.exports = router;