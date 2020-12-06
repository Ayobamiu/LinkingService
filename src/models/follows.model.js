const mongoose = require("mongoose");

const FollowSchema = mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Follow = mongoose.model("Follow", FollowSchema);

module.exports = Follow;
