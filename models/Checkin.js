const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reward: { type: Number, default: 10 },  // fixed reward
  date: { type: Date, default: Date.now } // check-in date
});

module.exports = mongoose.model("Checkin", checkinSchema);
