const mongoose = require("mongoose");

const MediaPlatformSampleSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    icon: {
      type: String,
    },
  }, 
  { timestamps: true }
);
const MediaPlatformSample = mongoose.model(
  "MediaPlatformSample",
  MediaPlatformSampleSchema
);

module.exports = MediaPlatformSample;
