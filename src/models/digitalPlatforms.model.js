const mongoose = require("mongoose");

const DigitalPlatformSchema = mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mediaPlatformSample: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MediaPlatformSample",
    },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
    },
    link: {
      type: String,
      trim: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const DigitalPlatform = mongoose.model(
  "DigitalPlatform",
  DigitalPlatformSchema
);

module.exports = DigitalPlatform;
