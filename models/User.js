const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true, unique: true },   // phone number
  password: { type: String },                                     // login password
  invitationCode: { type: String },                               // optional invite code
  tradePassword: { type: String },                                // trade password (set later)
  
  otp: { type: String },                                          // OTP (temporary)
  otpExpires: { type: Date },                                     // OTP expiry

  walletBalance: { type: Number, default: 0 },                    // default 0 balance

  //  Team & Referral System
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // kisne invite kiya
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // kis-kis ko invite kiya

  rechargeAmount: { type: Number, default: 0 },  // total recharge amount
  commission: { type: Number, default: 0 },      // total commission earned
  status: { type: String, enum: ["Active", "Inactive"], default: "Inactive" } // user active/inactive
}, 
{ timestamps: true });

module.exports = mongoose.model("User", userSchema);
