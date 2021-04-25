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
    backgroundImage: {
      type: String,
    },
  },
  { timestamps: true }
);
const Themes = mongoose.model("Themes", ThemesSchema);

module.exports = Themes;
