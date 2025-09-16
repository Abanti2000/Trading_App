// hashTradePasswords.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path if needed
const connectDB = require("./config/db");

dotenv.config();
connectDB();

async function hashExistingTradePasswords() {
  const users = await User.find({});
  for (let user of users) {
   
    if (user.tradePassword && !user.tradePassword.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(user.tradePassword, 10);
      user.tradePassword = hashed;
      await user.save();
      console.log(`Hashed trade password for user ${user._id}`);
    }
  }
  console.log("Done hashing trade passwords!");
  process.exit();
}

hashExistingTradePasswords();
