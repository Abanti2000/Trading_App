const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // link with Product
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // auto set from Product.price
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
