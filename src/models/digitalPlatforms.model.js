const mongoose = require("mongoose");

const DigitalPlatformSchema = mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    link: {
      type: String,
      trim: true,
    },
    viewCount: {
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
