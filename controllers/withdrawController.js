const User = require("../models/User");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");

// ✅ 1. Get Withdrawal Balance
const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, balance: user.walletBalance });
  } catch (err) {
    console.error("Balance error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ 2. Request Withdrawal
const requestWithdrawal = async (req, res) => {
  try {
    const { amount, tradePassword, bankCard } = req.body;

    if (!amount || !tradePassword || !bankCard) {
      return res.status(400).json({ 
        success: false, 
        message: "Amount, tradePassword and bankCard are required" 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Compare hashed trade password
    const isMatch = await bcrypt.compare(tradePassword, user.tradePassword);
    if (!isMatch) {
      await Transaction.create({ userId: user._id, type: "withdraw", amount, status: "RETURNED", bankCard });
      return res.status(401).json({ success: false, message: "Invalid trade password" });
    }

    if (user.walletBalance < amount) {
      await Transaction.create({ userId: user._id, type: "withdraw", amount, status: "RETURNED", bankCard });
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // Deduct balance
    user.walletBalance -= amount;
    await user.save();

    // Log successful transaction
    await Transaction.create({ userId: user._id, type: "withdraw", amount, status: "SUCCESS", bankCard });

    res.json({ 
      success: true, 
      message: `Withdrawal successful to ${bankCard}`, 
      newBalance: user.walletBalance 
    });
  } catch (error) {
    console.error("Withdraw request error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// ✅ 3. Withdrawal Records
const getWithdrawalRecords = async (req, res) => {
  try {
    const records = await Transaction.find({ userId: req.user.id, type: "withdraw" }).sort({ createdAt: -1 });

    // Map statuses to match Figma
    const formattedRecords = records.map(tx => ({
      amount: tx.amount,
      status: tx.status === "SUCCESS" ? "SUCCESS" : "RETURNED"
    }));

    res.json({ success: true, records: formattedRecords });
  } catch (error) {
    console.error("Withdrawal records error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = { getBalance, requestWithdrawal, getWithdrawalRecords };
