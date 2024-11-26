require('dotenv').config();
const Snoowrap = require('snoowrap');
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not defined in the environment variables.');
    }
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Posts', // Specify the "Posts" database
        });
        console.log('Connected to MongoDB successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit on failure
    }
};

// Reddit API setup
const isProduction = process.env.NODE_ENV === 'production';
const redditConfig = {
    userAgent: 'journalism-bot/1.0',
    clientId: isProduction ? process.env.REDDIT_CLIENT_ID_PROD : process.env.REDDIT_CLIENT_ID_DEV,
    clientSecret: isProduction ? process.env.REDDIT_CLIENT_SECRET_PROD : process.env.REDDIT_CLIENT_SECRET_DEV,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
};

const reddit = new Snoowrap(redditConfig);

// Mongoose Schema for the "palestine" collection
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: null },
    image: { type: String, default: null },
    url: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

// Specify the "palestine" collection in the "Posts" database
const Post = mongoose.model('palestine', postSchema);

// Fetch posts from a subreddit
async function fetchRedditPosts(subreddit) {
    const posts = await reddit.getSubreddit(subreddit).getHot({ limit: 10 });
    return posts.map(post => ({
        title: post.title,
        content: post.selftext || null,
        image: post.thumbnail.startsWith('http') ? post.thumbnail : null,
        url: post.url,
    }));
}

// Save posts to the database
async function savePosts(subreddit) {
    const posts = await fetchRedditPosts(subreddit);
    for (const post of posts) {
        const existingPost = await Post.findOne({ url: post.url });
        if (!existingPost) {
            await Post.create(post);
        }
    }
    console.log(`Posts from ${subreddit} saved to the database.`);
}

// Run the bot
async function runBot() {
    await connectDB();
    await savePosts('Palestine');
}

runBot();
