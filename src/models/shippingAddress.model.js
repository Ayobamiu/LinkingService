const mongoose = require("mongoose");

const ShippingAddressSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    addressLine: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  { timestamps: true }
);
const ShippingAddress = mongoose.model(
  "ShippingAddress",
  ShippingAddressSchema
);

module.exports = ShippingAddress;
