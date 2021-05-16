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
    subscription_id: {
      type: String,
    },
  },
  { timestamps: true }
);
const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
