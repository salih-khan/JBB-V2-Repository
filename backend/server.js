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

    app.use(cors());
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", "jbb-fullstack.onrender.com"], // Corrected here
          imgSrc: ["'self'", "data:", "blob:", "*"],
          mediaSrc: ["'self'", "*"], // Allow video sources
          connectSrc: ["'self'", "https://accounts.google.com"]
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
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    const authRoutes = require('./routes/auth.routes');
    const userRoutes = require('./routes/user.routes');

    app.use(authRoutes);
    app.use(userRoutes);

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
