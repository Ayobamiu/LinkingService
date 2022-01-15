/** @format */

const mongoose = require("mongoose");

const UserViewSchema = mongoose.Schema(
  {
    user: {
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
      default: "Earth",
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    longitude: {
      type: String,
    },
    latitude: {
      type: String,
    },
    deviceType: {
      type: String,
      enum: ["mobile", "desktop"],
    },
  },
  { timestamps: true }
);
const UserView = mongoose.model("UserView", UserViewSchema);

module.exports = UserView;
