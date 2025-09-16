const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["deposit", "withdraw", "recharge"], required: true }, 
  amount: { type: Number, required: true },
  status: { type: String, enum: ["SUCCESS", "RETURNED"], required: true }, // ensure uppercase
  bankCard: { type: String },   
  channel: { type: String },   
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
