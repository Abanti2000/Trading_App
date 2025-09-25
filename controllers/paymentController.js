const Payment = require("../models/Payment");
const Order = require("../models/Order");

//  Create Payment for an Order
exports.createPayment = async (req, res) => {
  try {
    const { userId, orderId } = req.body;

    if (!userId || !orderId) {
      return res.status(400).json({ success: false, message: "userId and orderId are required" });
    }

    // find order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // check if payment already exists for this order
    const existingPayment = await Payment.findOne({ orderRef: order._id });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: "Payment already exists for this order" });
    }

    // create payment linked to order
    const payment = await Payment.create({
      userId,
      orderRef: orderId,
      amount: order.totalAmount,
    });

    res.json({
      success: true,
      paymentId: payment._id,
      orderId: order._id,
      amount: payment.amount,
      status: payment.status
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Verify Payment with UTR
exports.verifyUTR = async (req, res) => {
  try {
    const { orderId, utrNumber } = req.body;

    const payment = await Payment.findOne({ orderRef: orderId });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found for this order" });

    payment.utrNumber = utrNumber;
    payment.status = "verified";
    payment.verifiedAt = new Date();
    await payment.save();

    res.json({ success: true, message: "UTR verified successfully", status: payment.status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Verify Payment with QR Upload
exports.verifyQR = async (req, res) => {
  try {
    const { orderId } = req.body;

    const payment = await Payment.findOne({ orderRef: orderId });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found for this order" });

    payment.qrImage = req.file.path;
    payment.status = "verified";
    payment.verifiedAt = new Date();
    await payment.save();

    res.json({ success: true, message: "QR uploaded and payment verified", status: payment.status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Get Payment Status
exports.getStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderRef: orderId });

    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    res.json({
      success: true,
      orderId: payment.orderRef,
      status: payment.status,
      utrNumber: payment.utrNumber,
      verifiedAt: payment.verifiedAt
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// //  Cancel Payment
// exports.cancelPayment = async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     const payment = await Payment.findOne({ orderRef: orderId });

//     if (!payment) return res.status(404).json({ success: false, message: "Payment not found for this order" });

//     payment.status = "cancelled";
//     await payment.save();

//     res.json({ success: true, status: payment.status });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ✅ Cancel Payment (and Order too)
exports.cancelPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const payment = await Payment.findOne({ orderRef: orderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found for this order" });
    }

    // Update payment
    payment.status = "cancelled";
    await payment.save();

    // Update related order also
    await Order.findByIdAndUpdate(orderId, { status: "cancelled" });

    res.json({ success: true, message: "Payment and order cancelled successfully", status: "cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

