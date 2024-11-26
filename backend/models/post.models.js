const mongoose = require('mongoose');
const { connectPostsDB } = require('../config/db.config');

const initializeModels = async () => {
  const postsDbConnection = await connectPostsDB();

    // Check if the model already exists to avoid OverwriteModelError
    if (postsDbConnection.models.Post) {
      return postsDbConnection.models.Post;
    }
    
  // Sub-schema for proofs
  const proofSchema = new mongoose.Schema({
    title: { type: String, required: true },
    source: { type: String, required: true },
    description: { type: String, required: true },
  }, { _id: false });

  const videoLinkSchema = new mongoose.Schema({
    url: {type: String, required: true},
  }, {_id: false });


  // Main schema for the post
  const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    proofs: [proofSchema],  // Array of proofs
    images: [String],       // Array of S3 image URLs
    nsfw: { type: Boolean, default: false },  // Flag for NSFW content
    nameId: { type: String },
    videoLinks: [videoLinkSchema],
    createdAt: { type: Date, default: Date.now }
  }, {
    collection: 'palestine'  // The collection in MongoDB
  });

  // Model for the post schema
  const Post = postsDbConnection.model('Post', postSchema);

  return Post;
};

module.exports = initializeModels;
