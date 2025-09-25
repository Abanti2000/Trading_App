const express = require("express");
const router = express.Router();
const { getMessages, createMessage, markMessageAsRead } = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getMessages);
router.post("/", auth, createMessage);
router.patch("/:id/read", auth, markMessageAsRead);


module.exports = router;
