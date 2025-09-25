const mongoose = require("mongoose");

const spinItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  amount: { type: Number, required: true },
  reward: { type: String, required: true },
  priority: { type: Number, required: true }
});

module.exports = mongoose.model("SpinItem", spinItemSchema);
