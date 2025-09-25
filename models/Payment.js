const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  orderRef: {   //  link to Order._id
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  utrNumber: String,
  qrImage: String,
  status: {
    type: String,
    enum: ["pending", "verified", "cancelled"],
    default: "pending"
  },
  verifiedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
