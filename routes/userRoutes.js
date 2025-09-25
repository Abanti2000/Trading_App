const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { getInvitation } = require("../controllers/userController");

// GET Invitation
router.get("/invitation", authMiddleware, getInvitation);

module.exports = router;
