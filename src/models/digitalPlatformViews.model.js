const mongoose = require("mongoose");

const DigitalPlatformViewSchema = mongoose.Schema(
  {
    digitalPlatform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "digitalPlatform",
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    visitorLocation: {
      type: String,
    },
  },
  { timestamps: true }
);
const DigitalPlatformView = mongoose.model(
  "DigitalPlatformView",
  DigitalPlatformViewSchema
);

module.exports = DigitalPlatformView;
