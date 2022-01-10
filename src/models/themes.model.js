/** @format */

const mongoose = require("mongoose");

const ThemesSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    color: {
      type: String,
    },
    backgroundColor: {
      type: String,
    },
    blur: {
      type: Number,
    },
    dark: {
      type: Number,
    },
    backgroundColorImageReplace: {
      type: String,
    },
    blured: {
      type: Boolean,
      default: false,
    },
    backgroundImage: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Themes = mongoose.model("Themes", ThemesSchema);

module.exports = Themes;
