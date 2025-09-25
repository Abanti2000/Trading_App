const SpinItem = require("../../models/SpinItem");
const User = require("../../models/User");
const LuckyDraw = require("../../models/LuckyDraw");

const DAILY_LIMIT = 3;

exports.getSpinItems = async (req, res) => {
  try {
    const items = await SpinItem.find({});
    res.json({ success: true, items });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

exports.startSpin = async (req, res) => {
  try {
    const userId = req.user.id;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todaySpins = await LuckyDraw.countDocuments({
      userId,
      createdAt: { $gte: startOfDay },
    });

    if (todaySpins >= DAILY_LIMIT) {
      return res
        .status(400)
        .json({ success: false, message: "Daily spin limit reached" });
    }

    const items = await SpinItem.find({});
    if (items.length !== 8) {
      return res
        .status(400)
        .json({ success: false, message: "Spin not configured" });
    }

    const totalPriority = items.reduce((sum, i) => sum + i.priority, 0);
    let rand = Math.random() * totalPriority;

    let selected;
    for (let i of items) {
      if (rand < i.priority) {
        selected = i;
        break;
      }
      rand -= i.priority;
    }

    const index = items.findIndex(
      (i) => i._id.toString() === selected._id.toString()
    );

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (selected.amount && selected.amount > 0) {
      user.walletBalance += selected.amount;
      await user.save();
    }

    await LuckyDraw.create({
      userId,
      prize: selected.name,
      amount: selected.amount,
      createdAt: new Date(),
    });

    res.json({
      success: true,
      winner: {
        index,
        id: selected._id,
        name: selected.name,
        reward: selected.reward,
        amount: selected.amount,
        walletBalance: user.walletBalance,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

