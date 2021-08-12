const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    destination: { type: String, default: "Own Account" },
    description: { type: String },
    currency: { type: String, default: "NGN" },
    status: {
      type: String,
      default: "completed",
      enum: ["completed", "failed", "pending"],
    },
    amount: { type: Number },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: { type: Object },
  },
  { timestamps: true }
);
const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
