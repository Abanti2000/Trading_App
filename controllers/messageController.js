const Message = require("../models/Message");

// GET /api/messages
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /api/messages
const createMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    const message = await Message.create({ userId, content });
    res.json({ success: true, data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PATCH /api/messages/:id/read
const markMessageAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.id;

    // Find the message that belongs to the logged-in user
    const message = await Message.findOne({ _id: messageId, userId });

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Update read status
    message.read = true;
    await message.save();

    res.json({ success: true, data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getMessages, createMessage, markMessageAsRead };

