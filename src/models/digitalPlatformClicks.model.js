const mongoose = require("mongoose");

const DigitalPlatformClickSchema = mongoose.Schema(
  {
    digitalPlatform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "digitalPlatform",
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
const DigitalPlatformClick = mongoose.model(
  "DigitalPlatformClick",
  DigitalPlatformClickSchema
);

module.exports = DigitalPlatformClick;
