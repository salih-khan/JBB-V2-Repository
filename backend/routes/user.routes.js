const express = require('express');
const { getUser, getAllUsers, updateProfile } = require('../controllers/user.controllers.js');
const router = express.Router();
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to log incoming requests
router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

router.get('/api/user', getUser);

router.get('/api/auth/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Authenticated');
    } else {
        res.status(401).send('Not authenticated');
    }
});

router.get('/api/getAllUsers', getAllUsers);

router.post('/api/updateProfile', upload.fields([{ name: 'bannerImage' }, { name: 'pfp' }]), (req, res, next) => {
    console.log("Inside upload middleware");
    next();
}, updateProfile);

module.exports = router;