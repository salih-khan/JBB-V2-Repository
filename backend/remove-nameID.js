const mongoose = require('mongoose');
require('dotenv').config(); // Adjust the path if necessary

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://salihkhan1701:Masjid_17*01_Aqsa@jbb-cluster.hnivwer.mongodb.net/?retryWrites=true&w=majority&appName=JBB-Cluster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      dbName: 'Accounts' // Specify the correct target database here
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const removeOldNameID = async () => {
  await connectDB();

  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections);

    const User = db.collection('users'); // Ensure this matches the collection name
    const sampleDoc = await User.findOne();
    console.log('Sample document:', sampleDoc);

    if (sampleDoc) {
      const result = await User.updateMany({}, { $unset: { nameID: "" } });
      console.log(`Updated ${result.modifiedCount} user(s), removed 'nameID' property.`);
    } else {
      console.log('No documents found in the users collection.');
    }
  } catch (error) {
    console.error('Error removing nameID:', error);
  } finally {
    mongoose.connection.close();
  }
};

removeOldNameID();