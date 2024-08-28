const mongoose = require('mongoose');

// Sub-schema for proofs
const proofSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  description: { type: String, required: true },
}, { _id: false });  // _id is set to false to prevent creation of separate IDs for each proof

// Main schema for the post
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  proofs: [proofSchema],  // Array of proofs
  images: [String],       // Array of S3 image URLs
  nsfw: { type: Boolean, default: false },  // Flag for NSFW content
}, {
  collection: 'palestine'  // The collection in MongoDB
});

// Model for the post schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;