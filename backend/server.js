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

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const primaryConnection = await connectPrimaryDB();
    const postsDbConnection = await connectPostsDB();

    const app = express();

    // CORS configuration
    const corsOptions = {
      origin: 'https://jbb-frontend.onrender.com',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    };

    app.use(cors(corsOptions));
    app.use(helmet());

    // Content Security Policy
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'https://jbb-fullstack.onrender.com'],
        imgSrc: ["'self'", 'data:', 'https://*'],
        connectSrc: ["'self'", 'https://jbb-fullstack.onrender.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://*'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://*'],
      },
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
