const mongoose = require("mongoose");

const ArtistViewSchema = mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
const ArtistView = mongoose.model("ArtistView", ArtistViewSchema);

module.exports = ArtistView;
