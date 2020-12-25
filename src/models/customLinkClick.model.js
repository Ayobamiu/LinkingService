const mongoose = require("mongoose");

const CustomLinkClickSchema = mongoose.Schema(
  {
    customLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomLink",
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
const CustomLinkClick = mongoose.model(
  "CustomLinkClick",
  CustomLinkClickSchema
);

module.exports = CustomLinkClick;
