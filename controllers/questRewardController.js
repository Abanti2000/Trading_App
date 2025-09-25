const mongoose = require("mongoose");

const User = require("../models/User");
const QuestReward = require("../models/QuestReward"); // if you later save claim history

// Static rewards as per Figma
const rewards = [
  {
    id: 1,
    title: "Daily Check-in",
    description: "Sign in daily to receive rewards",
    amount: 10.0,
    type: "daily-checkin"
  },
  {
    id: 2,
    title: "Invite Friends",
    description: "Invite friends to earn rewards",
    amount: 50.0,
    type: "invite"
  },
  {
    id: 3,
    title: "Upgrade Level",
    description: "Reach higher levels to unlock rewards",
    amount: 100.0,
    type: "level-up"
  }
];

//  Get all quest rewards
// Get quest rewards according to Figma
const getQuestRewards = async (req, res) => {
  try {
    const rewards = [
      { id: 1, level: 20,   amount: 1600,    invitedCount: 4 },
      { id: 2, level: 70,   amount: 5000,    invitedCount: 4 },
      { id: 3, level: 200,  amount: 13000,   invitedCount: 4 },
      { id: 4, level: 500,  amount: 50000,   invitedCount: 4 },
      { id: 5, level: 2000, amount: 180000,  invitedCount: 4 },
      { id: 6, level: 3000, amount: 500000,  invitedCount: 4 },
      { id: 7, level: 5000, amount: 888888,  invitedCount: 4 }
    ];

    const formatted = rewards.map(r => ({
      id: r.id,
      title: `Inviting activation of ${r.level}`,
      amount: r.amount,
      invitedCount: r.invitedCount,
      target: r.level,
      progress: `${r.invitedCount}/${r.level}`
    }));

    res.json({
      success: true,
      data: formatted
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Claim Daily Check-in
// Claim Daily Check-in
const claimDailyCheckin = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get today's date in YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Check if user already claimed daily check-in today
    const alreadyClaimed = await QuestReward.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      type: "daily-checkin",
      date: todayStr,
    });

    if (alreadyClaimed) {
      return res.status(400).json({ success: false, message: "Already claimed today" });
    }

    // Create a new daily check-in reward
    const rewardAmount = 10; // example reward points
    const newReward = await QuestReward.create({
      userId,
      type: "daily-checkin",
      amount: rewardAmount,
      date: todayStr,
    });

    return res.status(201).json({
      success: true,
      message: "Daily check-in claimed successfully",
      data: {
        rewardId: newReward._id,
        amount: rewardAmount,
        date: todayStr,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getQuestRewards, claimDailyCheckin };
