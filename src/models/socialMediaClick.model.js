const mongoose = require("mongoose");

const socialMediaClickSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "digitalPlatform",
      required: true,
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    socialMedia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SocialMedia",
    },
    visitorLocation: {
      type: String,
    },
  },
  { timestamps: true }
);
const socialMediaClick = mongoose.model(
  "socialMediaClick",
  socialMediaClickSchema
);

module.exports = socialMediaClick;
