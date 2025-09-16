const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getBalance, requestWithdrawal, getWithdrawalRecords } = require("../controllers/withdrawController");


router.get("/balance", auth, getBalance);
router.post("/request", auth, requestWithdrawal);
router.get("/records", auth, getWithdrawalRecords);

module.exports = router;
