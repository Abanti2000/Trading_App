const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  days: { type: Number, required: true },
  dailyIncome: { type: Number, required: true },
  totalIncome: { type: Number, required: true }
});

module.exports = mongoose.model("Product", productSchema);
