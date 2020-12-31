const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    images: [
      {
        image: {
          type: String,
        },
      },
    ],
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    cta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CTA",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
