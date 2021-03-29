const mongoose = require("mongoose");

const CustomLinkSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    link: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const CustomLink = mongoose.model("CustomLink", CustomLinkSchema);

module.exports = CustomLink;
