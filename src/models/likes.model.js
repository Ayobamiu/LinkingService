const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Like = mongoose.model("Like", LikeSchema);

module.exports = Like;
