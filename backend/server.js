const express = require('express');
const path = require('path');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();
require('./config/passport.config');

const { connectPrimaryDB, connectPostsDB } = require('./config/db.config');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const primaryConnection = await connectPrimaryDB();
    const postsDbConnection = await connectPostsDB();

    const Post = require('./models/post.models');

    const app = express();

    // CORS configuration
    const corsOptions = {
      origin: 'https://jbb-frontend.onrender.com',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    };

    app.use(cors(corsOptions));

    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "blob:", "*"],
          mediaSrc: ["'self'", "*"],
          connectSrc: ["'self'", "https://accounts.google.com"],
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
        client: primaryConnection.client,
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Cache control middleware
    app.use((req, res, next) => {
      if (req.path.endsWith('.html')) {
        res.set('Cache-Control', 'no-store'); // No caching for HTML
      } else {
        res.set('Cache-Control', 'public, max-age=31536000'); // 1 year for static assets
      }
      next();
    });

    // Serve static files from the frontend directory
    // app.use(express.static(path.join(__dirname, '../frontend/dist')));

    const authRoutes = require('./routes/auth.routes');
    const userRoutes = require('./routes/user.routes');

    app.use(authRoutes);
    app.use(userRoutes);

    // Catch-all route for serving the frontend
    // app.get('/*', (req, res) => {
    //   console.log('Catch-all route hit for:', req.originalUrl); // Debugging output
    //   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    // });


    app.get('/*', (req, res) => {
      res.redirect(`https://jbb-frontend.onrender.com/`);
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    return { postsDbConnection, Post };
  } catch (error) {
    console.error('Error initializing server:', error);
    process.exit(1);
  }
};

startServer();
