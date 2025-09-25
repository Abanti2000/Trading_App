const SpinItem = require("../../models/SpinItem");

exports.addOrUpdateSpinItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length !== 8) {
      return res
        .status(400)
        .json({ success: false, message: "Exactly 8 items required" });
    }

    await SpinItem.deleteMany({});
    const saved = await SpinItem.insertMany(items);

    res.json({ success: true, items: saved });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
