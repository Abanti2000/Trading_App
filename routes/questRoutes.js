const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { checkinUser, getCheckinRecords, getDailyRewardInfo } = require("../controllers/questController");

// Daily check-in
router.post("/checkin", authMiddleware, checkinUser);

// Get check-in records
router.get("/checkin/records", authMiddleware, getCheckinRecords);

// Get daily reward info (₹10.00)
router.get("/checkin/info", authMiddleware, getDailyRewardInfo);

module.exports = router;
