const mongoose = require("mongoose");

const EcommerceStoreSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    continent: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);
const EcommerceStore = mongoose.model("EcommerceStore", EcommerceStoreSchema);

module.exports = EcommerceStore;
