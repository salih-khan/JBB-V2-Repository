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

    // 1. Force Redirects
    app.use((req, res, next) => {
      // Redirect www to non-www
      if (req.headers.host === 'www.jbb.foundation') {
        return res.redirect(301, `https://jbb.foundation${req.url}`);
      }
      // Redirect HTTP to HTTPS
      if (!req.secure && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
      }
      // Redirect jbb-fullstack.onrender.com to jbb.foundation
      if (req.headers.host === 'jbb-fullstack.onrender.com') {
        return res.redirect(301, `https://jbb.foundation${req.url}`);
      }
      next();  // If all conditions fail, continue
    });

    // 2. CORS Configuration
    app.use(cors({
      origin: 'https://jbb-fullstack.onrender.com', // Replace with your frontend domain
      credentials: true  // Allow cookies and authentication credentials
    }));

    // 3. Content Security Policy (CSP) with Helmet
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", "https://jbb-fullstack.onrender.com", "https://www.jbb.foundation", "https://jbb.foundation"],
          scriptSrc: ["'self'", "https://accounts.google.com", "https://static.cloudflareinsights.com", "https://pagead2.googlesyndication.com"],  // Add the Google Ads domain
          scriptSrcElem: ["'self'", "https://static.cloudflareinsights.com", "https://accounts.google.com", "https://pagead2.googlesyndication.com"],  // Allow script elements from specific sources
          imgSrc: ["'self'", "data:", "blob:", "*"],  // Allow images from any secure source
          mediaSrc: ["'self'", "*"],  // Allow media from any source
          connectSrc: ["'self'", "https://accounts.google.com", "https://jbb-fullstack.onrender.com", "https://www.jbb.foundation", "https://jbb.foundation"],  // Allow API connections
          frameSrc: ["https://accounts.google.com"],  // Allow Google for OAuth
        }
      },
      crossOriginEmbedderPolicy: false // Disable for broader compatibility
    }));


    // 4. Session Configuration
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
        secure: true,  // Only send cookies over HTTPS
        httpOnly: true,  // Prevent client-side access to cookies
        sameSite: 'none',  // Allow cross-origin cookies (for Google OAuth, etc.)
        maxAge: 1000 * 60 * 60 * 24,  // Cookie expires after 1 day
      }
    }));

    // 5. Trust Proxy for Cloudflare or Render
    app.set('trust proxy', 1);

    // 6. Passport Initialization
    app.use(passport.initialize());
    app.use(passport.session());

    // 7. Serve Static Files
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // 8. Routes
    const authRoutes = require('./routes/auth.routes');
    const userRoutes = require('./routes/user.routes');

    app.use(authRoutes);
    app.use(userRoutes);

    // Debug Session Route
    app.get('/debug-session', (req, res) => {
      res.json({
        session: req.session,
        user: req.user,
      });
    });

    // Fallback Route for Frontend
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });

    // Start the Server
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
