const mongoose = require("mongoose");

const PromotionSchema = mongoose.Schema(
  {
    digitalPlatforms: [
      {
        mediaPlatformSample: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MediaPlatformSample",
        },
        link: {
          type: String,
        },
      },
    ],
    type: {
      type: String,
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
const Promotion = mongoose.model("Promotion", PromotionSchema);

module.exports = Promotion;
