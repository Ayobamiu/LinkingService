/** @format */

const mongoose = require("mongoose");

const WaitingUserSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },
  },
  { timestamps: true }
);
const WaitingUser = mongoose.model("WaitingUser", WaitingUserSchema);

module.exports = WaitingUser;
