import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import { connectPrimaryDB, connectPostsDB } from './config/db.config.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

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
