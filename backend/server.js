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

    // CORS configuration
    const corsOptions = {
      origin: 'https://jbb-frontend.onrender.com', // Allow only your frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods if needed
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    };

    // Apply CORS middleware
    app.use(cors(corsOptions));

    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "blob:", "*"],
          mediaSrc: ["'self'", "*"], // Allow video sources
          connectSrc: ["'self'", "https://accounts.google.com"], // Allow connections to Google accounts
        }
      }
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
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Serve static files from the frontend directory
    app.use(express.static(path.resolve('frontend', 'dist')));

    const authRoutes = require('./routes/auth.routes');
    const userRoutes = require('./routes/user.routes');

    app.use(authRoutes);
    app.use(userRoutes);

    // Catch-all route for serving the frontend
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('frontend', 'dist', 'index.html')); // Using path.resolve instead of __dirname
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    return { postsDbConnection, Post };  // Return the posts connection and model
  } catch (error) {
    console.error('Error initializing server:', error);
    process.exit(1);
  }
};

startServer();
