const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path'); // Import path for serving static files
const { connectPrimaryDB, connectPostsDB } = require('./config/db.config'); // Adjust the path as needed
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
require('./config/passport.config'); // Ensure the passport strategy is loaded

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const primaryConnection = await connectPrimaryDB();
    const postsDbConnection = await connectPostsDB();

    const app = express();

    // CORS configuration
    const corsOptions = {
      origin: 'https://jbb-fullstack.onrender.com', // Your frontend URL
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Update allowed methods
      credentials: true,
    };


    app.use(cors(corsOptions));
    app.use(helmet());

    // Content Security Policy to allow videos and other resources
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'https://jbb-fullstack.onrender.com'],
        imgSrc: ["'self'", 'data:', 'https://*', 'https://*.googleusercontent.com'], // Allow Google user profile images
        mediaSrc: ["'self'", 'https://*', 'https://*.youtube.com', 'https://*.vimeo.com'], // Allows video sources
        connectSrc: [
          "'self'",
          'https://jbb-fullstack.onrender.com',
          'https://*.googleapis.com',
          'https://*.gstatic.com', // Added for Google static content
          'https://*.google.com' // Allow connections to Google
        ], // API and external resources
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://*',
          'https://*.google.com', // Allow Google scripts
          'https://*.googleusercontent.com' // Allow Google user profile scripts
        ], // Allows inline scripts
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://*',
          'https://*.google.com' // Allow Google styles
        ], // Allows inline styles
      },
    }));


    // Session configuration
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: 'Accounts',
        collectionName: 'sessions',
        client: true, //primaryConnection.client
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false, // Prevents JavaScript access to cookies, for security
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-origin cookies in production
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // API routes
    app.use(authRoutes);
    app.use(userRoutes);

    // Serve static files from the frontend build directory
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Catch-all route for serving the frontend application
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    return { postsDbConnection };
  } catch (error) {
    console.error('Error initializing server:', error);
    process.exit(1);
  }
};

startServer();
