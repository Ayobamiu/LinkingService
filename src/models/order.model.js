const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["started", "success", "failed"],
      default: "started",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
