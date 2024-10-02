const express = require('express');
const multer = require('multer');
const { 
    getUser, 
    getAllUsers, 
    updateProfile, 
    newPost, 
    getAllPostsFromUser, 
    getAllPosts,
    getAllPostsFromCategory,
    getIndividualPost
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
router.get('https://jbb-fullstack.onrender.com/api/user', getUser);

// Route to check authentication status
router.get('https://jbb-fullstack.onrender.com/api/auth/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Authenticated');
    } else {
        res.status(401).send('Not authenticated');
    }
});

// Route to create a new post
router.post('https://jbb-fullstack.onrender.com/api/newPost', upload.array('images'), newPost);

// Route to get all users
router.get('https://jbb-fullstack.onrender.com/api/getAllUsers', getAllUsers);

// Route to get all posts (current month)
router.get('https://jbb-fullstack.onrender.com/api/getAllPosts', getAllPosts);

// Route to update the user's profile
router.post('https://jbb-fullstack.onrender.com/api/updateProfile',
    upload.fields([{ name: 'bannerImage' }, { name: 'pfp' }]), 
    (req, res, next) => {
        console.log("Inside upload middleware");
        next();
    }, 
    updateProfile
);

// Route to get all posts from a specific user
router.get('https://jbb-fullstack.onrender.com/api/getAllPostsFromUser', getAllPostsFromUser);

//for the /categorypalestine
router.get('https://jbb-fullstack.onrender.com/api/getAllPostsFromCategory', getAllPostsFromCategory);

//when the user wants to see the info for 1 post alone
router.get('https://jbb-fullstack.onrender.com/api/getIndividualPost/:postId', getIndividualPost);

module.exports = router;