const mongoose = require("mongoose");

const PromotionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User ",
    },
    digitalPlatforms: [
      {
        digitalPlatform: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DigitalPlatform",
        },
      },
    ],
    type: {
      type: String,
      enum: ["ep", "track", "album"],
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    title: {
      type: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Promotion = mongoose.model("Promotion", PromotionSchema);

module.exports = Promotion;
