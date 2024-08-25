const express = require('express');
const path = require('path');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors'); // Add this line
const mongoose = require('mongoose');
require('dotenv').config();
require('./config/passport.config'); // Import the passport configuration

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      dbName: 'Accounts' // Specify the target database here
    });
    console.log('Connected to Primary MongoDB');
  } catch (err) {
    console.error('Primary MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

const sessionConnection = mongoose.createConnection(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

sessionConnection.on('connected', () => {
  console.log('Connected to Session MongoDB');
});

sessionConnection.on('error', (err) => {
  console.error('Session MongoDB connection error:', err);
});
const app = express();

app.use(cors()); // Enable CORS for all routes


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "*"], // Allow images from self, data, and blob URLs
      connectSrc: ["'self'", "https://accounts.google.com"]
    }
  }
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    dbName: 'Accounts', // Specify the target database here
    client: sessionConnection.getClient(),
    collectionName: 'sessions'
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
