const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createPayment,
  verifyUTR,
  verifyQR,
  getStatus,
  cancelPayment
} = require("../controllers/paymentController");

//  Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.post("/create", createPayment);
router.post("/verify-utr", verifyUTR);
router.post("/verify-qr", upload.single("qrImage"), verifyQR);
router.get("/status/:orderId", getStatus);
router.post("/cancel", cancelPayment);

module.exports = router;
