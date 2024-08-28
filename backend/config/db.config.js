const mongoose = require('mongoose');

let primaryConnection;
let postsConnection;

const connectPrimaryDB = async () => {
  if (primaryConnection) return primaryConnection;
  try {
    primaryConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      dbName: 'Accounts'
    });
    console.log('Connected to Primary MongoDB');
    return primaryConnection;
  } catch (err) {
    console.error('Primary MongoDB connection error:', err);
    process.exit(1);
  }
};

const connectPostsDB = async () => {
  if (postsConnection) return postsConnection;
  try {
    postsConnection = mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      dbName: 'Posts'
    });
    postsConnection.on('connected', () => {
      console.log('Connected to Posts MongoDB');
    });
    postsConnection.on('error', (err) => {
      console.error('Posts MongoDB connection error:', err);
    });
    return postsConnection;
  } catch (err) {
    console.error('Posts MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = {
  connectPrimaryDB,
  connectPostsDB
};
