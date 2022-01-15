/** @format */

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
    image: {
      type: String,
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
// CustomLinkSchema.virtual("clicksCount", {
//   ref: "CustomLinkClick",
//   localField: "_id",
//   foreignField: "customLink",
//   count: true, // And only get the number of docs
// });

const CustomLink = mongoose.model("CustomLink", CustomLinkSchema);

module.exports = CustomLink;
