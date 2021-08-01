const mongoose = require("mongoose");

const EcommerceStoreSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    phoneOne: {
      type: String,
    },
    phoneTwo: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    continent: {
      type: String,
    },
    country: {
      type: String,
    },
    allowPickup: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

EcommerceStoreSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "store",
});
const EcommerceStore = mongoose.model("EcommerceStore", EcommerceStoreSchema);

module.exports = EcommerceStore;
