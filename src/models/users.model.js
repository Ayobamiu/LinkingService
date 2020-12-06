const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["artist", "visitor"],
      default: "artist",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    stageName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    viewCount: { 
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    followerCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
