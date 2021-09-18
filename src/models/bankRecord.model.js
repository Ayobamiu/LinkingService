const mongoose = require("mongoose");

const BankRecordSchema = mongoose.Schema(
  {
    accountNumber: { type: String },
    bankName: { type: String },
    accountName: { type: String },
    bank: { type: Object },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const BankRecord = mongoose.model("BankRecord", BankRecordSchema);

module.exports = BankRecord;
