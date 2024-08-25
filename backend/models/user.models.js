const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    nameId: { type: String, unique: true }, // Add the nameID field
    email: String,
    imageUrl: String,
    bio: String,
    dateJoined: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    description:  { type: String, default: "Hello user! Welcome to your profile page. Get started with customising right away." },
    bannerImage: String
});

userSchema.pre('save', function(next) {
    console.log('Saving user:', this);
    next();
});

userSchema.pre('updateOne', function(next) {
    this.set({ lastUpdated: new Date() });
    console.log('Updating user:', this.getUpdate());
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;