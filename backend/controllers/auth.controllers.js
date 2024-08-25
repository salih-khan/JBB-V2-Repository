const fs = require('fs');
const path = require('path');
const s3 = require('../config/aws.config');
const User = require('../models/user.models'); // Adjust the path if necessary

// Helper function to upload files to S3
const uploadToS3 = async (filePath, folder, filename) => {
    const fileContent = fs.readFileSync(filePath);
    const extension = path.extname(filePath); // Get the file extension
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${filename}${extension}`, // unique key for the image with extension
        Body: fileContent,
        ContentType: 'image/jpeg', // Assuming the default images are JPEG
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // returns the URL of the uploaded image
    } catch (err) {
        console.error("Error uploading to S3:", err);
        throw new Error("Error uploading to S3");
    }
};

// Function to get all users
async function getAllUsers(req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

// Function to create a new user
async function createUser(profile) {
    const imageUrl = profile.photos?.[0]?.value ?? undefined;
    const email = profile.emails?.[0]?.value ?? undefined;

    const users = await User.find({});
    let nameId;

    if (users.length === 0) {
        // If no users exist, create the first user with a default nameID
        nameId = 'user_1';
    } else {
        // Generate a unique nameID
        nameId = await generateUniqueNameId(users);
    }

    // Paths to default images
    const defaultProfilePicturePath = path.join(__dirname, '../../frontend/src/assets/defaultProfilePicture.jpg');
    const defaultBannerImagePath = path.join(__dirname, '../../frontend/src/assets/defaultBannerImage.jpg');

    // Upload default images to S3
    const profilePictureUrl = await uploadToS3(defaultProfilePicturePath, `users/${nameId}`, 'profilePicture');
    const bannerImageUrl = await uploadToS3(defaultBannerImagePath, `users/${nameId}`, 'bannerImage');

    const newUser = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        nameId: nameId,
        email: email,
        imageUrl: profilePictureUrl,
        bannerImage: bannerImageUrl,
        dateJoined: new Date(),
        lastUpdated: new Date(),
        description: "Hello user! Welcome to your profile page. Get started with customising right away." // Default description
    });

    const savedUser = await newUser.save();
    console.log('New user created:', savedUser);
    return savedUser;
}

// Function to generate a unique nameID
async function generateUniqueNameId(existingUsers = []) {
    let unique = false;
    let nameId;

    while (!unique) {
        nameId = 'user_' + Math.floor(Math.random() * 1000000); // Generate a random nameID
        unique = !existingUsers.some(user => user.nameId === nameId);
    }

    return nameId;
}

// Google OAuth callback function
async function verifyCallbackFunction(accessToken, refreshToken, profile, done) {
    console.log("Google profile retrieved: ", profile);

    try {
        let existingUser = await User.findOne({ googleId: profile.id });
        console.log("Existing user from DB:", existingUser);

        if (existingUser) {
            return done(null, existingUser);
        } else {
            const newUser = await createUser(profile);
            return done(null, newUser);
        }
    } catch (err) {
        console.error('Error in verifyCallbackFunction:', err);
        done(err, null);
    }
}

// Middleware to check if the user is logged in
function checkLoggedIn(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'You must log in!' });
    } else {
        next();
    }
}

module.exports = {
    getAllUsers,
    verifyCallbackFunction,
    checkLoggedIn
};
