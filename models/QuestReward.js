const mongoose = require("mongoose");

const questRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },   // e.g. "daily-checkin"
  amount: { type: Number, required: true },
  date: { type: String, required: true }    // YYYY-MM-DD
});

module.exports = mongoose.model("QuestReward", questRewardSchema);
