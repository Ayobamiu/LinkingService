const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "started",
        "sent",
        "received",
        "cancelled",
        "rejected",
        "completed",
      ],
      default: "started",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    dileveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingAddress",
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
    },
    shippingFee: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    eta: {
      type: Date,
      default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
