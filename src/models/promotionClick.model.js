const mongoose = require("mongoose");

const PromotionClickSchema = mongoose.Schema(
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
const PromotionClick = mongoose.model("PromotionClick", PromotionClickSchema);

module.exports = PromotionClick;
