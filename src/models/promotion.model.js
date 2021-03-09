const mongoose = require("mongoose");
const uniqueSlug = require("unique-slug");

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
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

PromotionSchema.pre("save", async function (next) {
  const promotion = this;
  if (promotion.isModified("title")) {
    promotion.link = promotion.title.replace(/\s/g, "");
  }

  next();
});

const Promotion = mongoose.model("Promotion", PromotionSchema);

module.exports = Promotion;
