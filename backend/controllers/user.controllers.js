const User = require('../models/user.models'); // Adjust the path if necessary
const s3 = require('../config/aws.config');
const path = require('path');
const mongoose = require('mongoose'); // <-- Add this line

//for uploading the images from the posts to the S3Bucket
let Post; // Declare Post globally, but don't initialize it
const initializeModels = require('../models/post.models'); // Import model initialization


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
        res.status(401).json({
            error: 'User not authenticated'
        });
    }
}

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
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
        console.log("req.body = ", req.body); // Add logging
        const {
            displayName,
            userId,
            bio
        } = req.body;
        const bannerImage = req.files['bannerImage'] ? req.files['bannerImage'][0] : null;
        const profilePicture = req.files['pfp'] ? req.files['pfp'][0] : null;
        let description = bio;
        console.log('Received request body:', req.body);
        console.log('Received files:', req.files);

        // Find user by _id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
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
        const updatedUser = await User.findOneAndUpdate({
            _id: userId
        }, update, {
            new: true
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

//upload images from posts to S3
// Function to upload images to S3 and return URLs
const uploadPostImagesToS3 = async (files, nameId, postId) => {
    try {
        const imageUrls = await Promise.all(files.map(async (file) => {
            const extension = file.originalname.split('.').pop(); // Get the file extension

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `posts/${nameId}/${postId}/${Date.now()}_${file.originalname}`, // Include userId and postId in the path
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const {
                Location
            } = await s3.upload(params).promise();
            return Location; // Return the S3 URL
        }));

        return imageUrls;
    } catch (error) {
        console.error('Error uploading images to S3:', error);
        throw new Error('Error uploading images to S3');
    }
};


// Ensure Post model is initialized
const initializePostModel = async () => {
    if (!Post || Post == "undefined" || Post == null) {
        Post = await initializeModels(); // Initialize and assign Post model
    }
};

const newPost = async (req, res) => {
    try {
        await initializePostModel(); // Ensure Post is initialized

        const {
            title,
            description,
            date,
            proofs,
            nsfw
        } = req.body;
        const files = req.files;
        const nameId = req.user.nameId; // Get the user's nameId
        const postId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for the post

        // Upload images to S3 using the postId to organize them
        const imageUrls = await uploadPostImagesToS3(files, nameId, postId);

        // Check if proofs are already an array or object
        let parsedProofs;
        if (typeof proofs === 'string') {
            parsedProofs = JSON.parse(proofs); // Parse if proofs is a JSON string
        } else {
            parsedProofs = proofs; // Use directly if it's already an object/array
        }

        // Create a new post with the details and image URLs
        // Create a new post with the details and image URLs
        const newPost = new Post({
            _id: postId,
            title,
            description,
            date: new Date(date),
            proofs: parsedProofs,
            images: imageUrls,
            nsfw,
            nameId: nameId
        });

        // Save the post to MongoDB
        await newPost.save();

        // Respond to the client
        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            message: 'Error creating post',
            error: error.message
        });
    }
};

//this is a function to get all the posts made by a user 
//the user is an arg to be passed in so it can be re-used many times
//this function is used on ProfilePage.vue when loading in

const getAllPostsFromUser = async (req, res, nameId) => {
    try {
        const {
            nameId
        } = req.query; // Extract nameId from query parameters

        if (!nameId) {
            return res.status(400).json({
                error: 'nameId is required'
            });
        }
        // Fetch the user by nameId (optional, if you need to verify the user exists)
        const user = await User.findOne({
            nameId: nameId
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Fetch all posts by the nameId
        const Post = await initializeModels();
        const posts = await Post.find({
            nameId: nameId
        });


        if (posts.length === 0) {
            return res.status(404).json({
                message: 'No posts found for this user'
            });
        }

        // Return the posts
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};


const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query; // Default page and limit
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

        await initializePostModel(); // Ensure Post is initialized

        // Fetch the most recent posts for the current month
        let posts = await Post.find({
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        })
        .sort({ date: -1 })
        .skip((page - 1) * limit) // Pagination: Skip the previous pages
        .limit(parseInt(limit));

        // If no recent posts or fewer than limit, fetch older posts
        if (posts.length < limit) {
            const remainingLimit = limit - posts.length;
            const olderPosts = await Post.find({
                date: {
                    $lt: startOfMonth
                }
            })
            .sort({ date: -1 })
            .limit(remainingLimit);
            posts = [...posts, ...olderPosts]; // Combine recent and older posts
        }

        res.status(200).json(posts);

    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

//this is refering to the Palestine buttong that takes you to 
// '/category/palestine'
// Function to get posts from a specific category with pagination
const getAllPostsFromCategory = async (req, res) => {
    try {
        await initializePostModel(); // Ensure Post is initialized

        // Fetch all posts
        const posts = await Post.find({}).sort({ createdAt: -1 }).lean();

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};



module.exports = {
    getUser,
    getAllUsers,
    updateProfile,
    newPost,
    getAllPostsFromUser,
    getAllPosts,
    getAllPostsFromCategory
};