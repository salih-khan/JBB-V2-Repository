const User = require('../models/user.models'); // Adjust the path if necessary
const s3 = require('../config/aws.config');
const path = require('path');

//for uploading the images from the posts to the S3Bucket
const Post = require('../models/post.models'); // Adjust the path if necessary

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
        console.error('Error updating profile:', error)git;
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

//upload images from posts to S3
// Function to upload images to S3 and return URLs
const uploadPostImagesToS3 = async (files) => {
    try {
        const imageUrls = await Promise.all(files.map(async (file) => {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `posts/${userId}/${postId}/${Date.now()}_${file.originalname}${extension}`, // Include userId and postId in the path
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const { Location } = await s3.upload(params).promise();
            return Location;  // Return the S3 URL
        }));

        return imageUrls;
    } catch (error) {
        console.error('Error uploading images to S3:', error);
        throw new Error('Error uploading images to S3');
    }
};

const newPost = async (req, res) => {
    try {
        const { title, description, date, proofs, nsfw } = req.body;
        const files = req.files;
        const userId = req.user._id; // Get the current user ID
        const postId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for the post

        // Upload images to S3
        const imageUrls = await uploadPostImagesToS3(files);

        // Create a new post with the details and image URLs
        const newPost = new Post({
            _id: postId,
            title,
            description,
            date: new Date(date),
            proofs: JSON.parse(proofs),  // Assuming proofs is sent as a JSON string
            images: imageUrls,
            nsfw,
        });
        // Save the post to MongoDB
        await newPost.save();

        // Respond to the client
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

module.exports = {
    getUser,
    getAllUsers,
    updateProfile,
    newPost
};