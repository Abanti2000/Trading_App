const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const { 
  register, 
  login, 
  setTradePassword, 
  generateOtp,
  generateTradePasswordOtp
} = require("../controllers/authController");

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/generate-otp", generateOtp);
router.post("/generate-trade-otp", generateTradePasswordOtp);
router.post("/set-trade-password", authMiddleware, setTradePassword);


module.exports = router;
