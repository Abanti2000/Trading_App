const User = require("../models/User");
const Checkin = require("../models/Checkin");

// Daily check-in
const checkinUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already checked-in today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingCheckin = await Checkin.findOne({
      userId,
      date: { $gte: startOfDay }
    });

    if (existingCheckin) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today"
      });
    }

    // Add reward
    const reward = 10;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.walletBalance = (user.walletBalance || 0) + reward;
    await user.save();

    // Save check-in record
    const checkin = await Checkin.create({ 
      userId, 
      reward, 
      date: new Date() 
    });

    return res.status(201).json({
      success: true,
      message: "Daily check-in successful",
      reward,
      walletBalance: user.walletBalance,
      checkin
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get check-in records Sign in record
const getCheckinRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Checkin.find({ userId })
      .select("date reward")
      .sort({ date: -1 });

    const formatted = records.map(r => ({
      _id: r._id,
      title: `Bonus ${r.reward}`,
      reward: `₹${r.reward.toFixed(2)}`,
      date: new Date(r.date).toISOString().replace("T", " ").slice(0, 19), 
      icon: "gift.png"
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Get daily reward info (₹10.00 fixed)
const getDailyRewardInfo = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      rewardAmount: 10,
      message: "Daily check-in can receive ₹10.00"
    }
  });
};

module.exports = { checkinUser, getCheckinRecords, getDailyRewardInfo };
