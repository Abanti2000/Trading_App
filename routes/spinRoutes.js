const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const adminController = require("../controllers/admin/spinController");
const clientController = require("../controllers/client/spinController");

// ---------------- ADMIN ----------------
router.post("/admin/spin-items", adminController.addOrUpdateSpinItems);

// ---------------- CLIENT ----------------
router.get("/client/spin-items", clientController.getSpinItems);
router.post("/client/spin/start", authMiddleware, clientController.startSpin);


module.exports = router;




