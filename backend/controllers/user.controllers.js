const User = require('../models/user.models'); // Adjust the path if necessary
const s3 = require('../config/aws.config');
const path = require('path');

// Function to get the current user
function getUser(req, res) {
    if (req.user) {
        console.log("User from server: ", req.user);
        return res.json({
            displayName: req.user.displayName,
            nameId: req.user.nameId,
            email: req.user.email,
            imageUrl: req.user.imageUrl,
            dateJoined: req.user.dateJoined,
            description: req.user.description,
            bannerImage: req.user.bannerImage,
            _id: req.user._id
        });
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
}

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Helper function to upload files to S3
const uploadToS3 = async (file, folder, filename) => {
    const extension = path.extname(file.originalname); // Get the file extension
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folder}/${filename}${extension}`, // unique key for the image with extension
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // returns the URL of the uploaded image
    } catch (err) {
        console.error("Error uploading to S3:", err);
        throw new Error("Error uploading to S3");
    }
};

// Helper function to delete files from S3
const deleteFromS3 = async (fileKey) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
    };

    try {
        await s3.deleteObject(params).promise();
        console.log(`Deleted ${fileKey} from S3`);
    } catch (err) {
        console.error("Error deleting from S3:", err);
        throw new Error("Error deleting from S3");
    }
};

// Function to update the user's profile
const updateProfile = async (req, res) => {
    try {
        console.log("req.body = ", req.body);  // Add logging
        const { displayName, userId, bio } = req.body;
        const bannerImage = req.files['bannerImage'] ? req.files['bannerImage'][0] : null;
        const profilePicture = req.files['pfp'] ? req.files['pfp'][0] : null;
        let description = bio;
        console.log('Received request body:', req.body);
        console.log('Received files:', req.files);

        // Find user by _id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prepare update object
        const update = {
            displayName,
            description,
        };

        // Delete old profile picture if a new one is uploaded
        if (profilePicture) {
            if (user.imageUrl) {
                const oldProfilePictureKey = user.imageUrl.split('.com/')[1]; // Get the key from the URL
                await deleteFromS3(oldProfilePictureKey);
            }
            const profilePictureUrl = await uploadToS3(profilePicture, `users/${user._id}`, 'profilePicture');
            update.imageUrl = profilePictureUrl;
        }

        // Upload new banner image if provided
        if (bannerImage) {
            const bannerImageUrl = await uploadToS3(bannerImage, `users/${user._id}`, 'bannerImage');
            update.bannerImage = bannerImageUrl;
        }

        console.log('Update object:', update);

        // Update user in the database
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, update, { new: true });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = {
    getUser,
    getAllUsers,
    updateProfile,
};