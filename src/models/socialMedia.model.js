const mongoose = require("mongoose");

const SocialMediaSchema = mongoose.Schema(
  {
    mediaPlatformSample: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaPlatformSample",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    link: {
      type: String,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const SocialMedia = mongoose.model("SocialMedia", SocialMediaSchema);

module.exports = SocialMedia;
