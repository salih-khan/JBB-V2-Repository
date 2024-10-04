const express = require('express');
const path = require('path');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();
require('./config/passport.config');

const { connectPrimaryDB, connectPostsDB } = require('./config/db.config'); // Import from db.config

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const primaryConnection = await connectPrimaryDB();  // Ensure primary connection is established
    const postsDbConnection = await connectPostsDB();    // Ensure posts connection is established

    const Post = require('./models/post.models');  // Ensure this import is correct

    const app = express();

    // 1. CORS Configuration
    app.use(cors({
      origin: 'https://jbb-fullstack.onrender.com', // Replace with your frontend domain
      credentials: true  // Allow cookies and authentication credentials
    }));

// 2. Content Security Policy (CSP) with Helmet
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", "https://jbb-fullstack.onrender.com"],  // Allow frontend in production
          scriptSrc: ["'self'", "https://accounts.google.com", "https://static.cloudflareinsights.com"],  // Add Cloudflare Insights and Google for OAuth
          scriptSrcElem: ["'self'", "https://static.cloudflareinsights.com", "https://accounts.google.com"],  // Allow script elements from specific sources
          imgSrc: ["'self'", "data:", "blob:", "*"],  // Allow images from any secure source
          mediaSrc: ["'self'", "*"],  // Allow media from any source
          connectSrc: ["'self'", "https://accounts.google.com", "https://jbb-fullstack.onrender.com"],  // Allow API connections
          frameSrc: ["https://accounts.google.com"],  // Allow Google for OAuth
        }
      },
      crossOriginEmbedderPolicy: false // Disable for broader compatibility
    }));

    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: 'Accounts',
        collectionName: 'sessions',
        client: primaryConnection.client // Use the primary database connection here
      }),
      cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,  // Prevents client-side JavaScript from accessing cookies
        sameSite: 'none', // Allow cross-origin cookies
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    const authRoutes = require('./routes/auth.routes');
    const userRoutes = require('./routes/user.routes');

    app.use(authRoutes);
    app.use(userRoutes);

    app.get('/debug-session', (req, res) => {
      res.json({
        session: req.session,
        user: req.user,
      });
    });

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${PORT}`);
    });



    // Example usage
    // const newPost = new Post({ title: 'Sample', description: 'Description', date: new Date() });
    // await newPost.save();

    return { postsDbConnection, Post };  // Return the posts connection and model
  } catch (error) {
    console.error('Error initializing server:', error);
    process.exit(1);
  }
};

startServer();
