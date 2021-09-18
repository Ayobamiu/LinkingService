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
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    invoice: {
      type: String,
    },
    deliveryMethod: {
      type: String,
      default: "pickUp",
    },
    deliveryMerchant: {
      type: String,
      default: "Monaly Express",
    },
    dileveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingAddress",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    shippingFee: {
      type: Number,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EcommerceStore",
      required: true,
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
