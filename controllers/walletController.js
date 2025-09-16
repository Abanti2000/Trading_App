// controllers/walletController.js
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const rechargeWallet = async (req, res) => {
  try {
    const { amount, channel } = req.body;  
    const { mobileNumber } = req.user;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Enter a valid amount" });
    }

    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Update balance
    user.walletBalance += amount;
    await user.save();

    // Transaction log
    await Transaction.create({
      userId: user._id,
      type: "recharge",
      amount,
      status: "SUCCESS",
      channel
    });

    res.json({
      message: "✅ Wallet recharged successfully",
      walletBalance: user.walletBalance,
    });
  } catch (err) {
    console.error("Recharge error:", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { rechargeWallet };
