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
    video: {
      type: String,
    },
    price: {
      type: Number,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    numberInStock: {
      type: Number,
      default: 1,
    },
    isAssured: {
      type: Boolean,
      default: false,
    },
    returnable: {
      type: Boolean,
      default: false,
    },
    cta: {
      type: String,
      default: "buy",
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
