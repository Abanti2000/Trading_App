const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getQuestRewards, claimDailyCheckin } = require("../controllers/questRewardController");

// Get all rewards
router.get("/", authMiddleware, getQuestRewards);

// Claim Daily Check-in
router.post("/daily-checkin", authMiddleware, claimDailyCheckin);

module.exports = router;
