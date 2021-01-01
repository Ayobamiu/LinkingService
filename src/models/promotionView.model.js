const mongoose = require("mongoose");

const PromotionViewSchema = mongoose.Schema(
  {
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
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
const PromotionView = mongoose.model("PromotionView", PromotionViewSchema);

module.exports = PromotionView;
