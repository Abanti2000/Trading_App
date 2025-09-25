const Order = require("../models/Order");
const Product = require("../models/Product"); // for price lookup

//  Create new order
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    let orderItems = [];
    let totalAmount = 0;

    for (let item of items) {
      // find product
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const itemPrice = product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += itemPrice;
    }

    //  Create new order
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      status: "pending"
    });

    //  Clean response with `orderId` instead of `_id`
    res.status(201).json({
      success: true,
      data: {
        orderId: order._id, // renamed for clarity
        userId: order.userId,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

//  Get all orders of a user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .populate("items.productId", "name price");

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

module.exports = { createOrder, getUserOrders };
