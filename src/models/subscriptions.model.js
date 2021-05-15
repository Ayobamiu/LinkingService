const mongoose = require("mongoose");

const SubscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: {
      type: Date,
      default: new Date(),
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);
const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
