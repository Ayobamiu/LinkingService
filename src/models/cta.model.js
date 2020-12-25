const mongoose = require("mongoose");

const CTASchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);
const CTA = mongoose.model("CTA", CTASchema);

module.exports = CTA;
