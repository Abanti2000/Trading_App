const mongoose = require("mongoose");

const luckyDrawSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  prize: { type: String, required: true },        // e.g. "50 Coins", "No Prize"
  amount: { type: Number, default: 0 },           // wallet amount or coins
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LuckyDraw", luckyDrawSchema);
