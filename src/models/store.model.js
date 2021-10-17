const mongoose = require("mongoose");
const Transaction = require("./transaction.model");

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
    banner: {
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
    location: {
      type: Object,
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
    timestamps: true,
  }
);

EcommerceStoreSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "store",
});

// EcommerceStoreSchema.methods.toJSON = async function () {
//   const data = this;
//   const transaction = await Transaction.aggregate([
//     {
//       $match: {
//         type: "plus",
//       },
//     },
//     {
//       $group: {
//         _id: "$_id",
//         total: { $sum: "$amount" },
//       },
//     },
//   ]);
//   const store = data.toObject();
//   store.total = transaction.total;
//   return store;
// };
const EcommerceStore = mongoose.model("EcommerceStore", EcommerceStoreSchema);

module.exports = EcommerceStore;
