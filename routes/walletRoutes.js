const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware"); //  token verification middleware
const { rechargeWallet } = require("../controllers/walletController");

// ✅ Recharge Wallet
router.post("/recharge", auth, rechargeWallet);

// ✅ Get Wallet Balance
router.get("/balance", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // user id JWT se aayegi
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      balance: user.walletBalance,
    });
  } catch (err) {
    console.error("Balance error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
