// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const Transaction = require("../models/Transaction");
// const { generateOTP } = require("../utils/otpGenerator");
// const jwt = require("jsonwebtoken");



// const generateOtp = async (req, res) => {
//   try {
//     const { mobileNumber } = req.body;

//     let user = await User.findOne({ mobileNumber });

//     // Agar user exist nahi karta, to naya create karo
//     if (!user) {
//       user = new User({ mobileNumber });
//     }

//     // OTP generate karo
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpires = Date.now() + 5 * 60 * 1000;

//     user.otp = otp;
//     user.otpExpires = otpExpires;

//     await user.save();

//     console.log(` OTP for ${mobileNumber}: ${otp}`);

//     res.json({ message: "OTP generated successfully", otp });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// const generateTradePasswordOtp = async (req, res) => {
//   try {
//     const { mobileNumber } = req.body;

//     const user = await User.findOne({ mobileNumber });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpires = Date.now() + 5 * 60 * 1000; // valid 5 minutes

//     user.otp = otp;
//     user.otpExpires = otpExpires;
//     await user.save();

//     console.log(` Trade Password OTP for ${mobileNumber}: ${otp}`);

//     res.json({ message: "OTP generated successfully", otp }); // ⚠️ dev mode me otp send
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



// const register = async (req, res) => {
//   try {
//     const { mobileNumber, password, invitationCode, otp } = req.body;

//     const user = await User.findOne({ mobileNumber });
//     if (!user) {
//       return res.status(400).json({ message: "User not found. Please generate OTP first." });
//     }

//     if (user.password) {
//       return res.status(400).json({ message: "This number is already registered. Please login." });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (!user.otpExpires || Date.now() > user.otpExpires) {
//       return res.status(400).json({ message: "OTP has expired" });
//     }

//     user.password = await bcrypt.hash(password, 10);
//     user.invitationCode = invitationCode;
//     user.otp = null;
//     user.otpExpires = null;

//     await user.save();

//     res.json({ message: " Registration successful" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };




// // Login
// const login = async (req, res) => {
//   try {
//     const { mobileNumber, password } = req.body;

//     // Validate input
//     if (!mobileNumber || !password) {
//       return res.status(400).json({ message: "Mobile number and password are required" });
//     }

//     // Find user
//     const user = await User.findOne({ mobileNumber });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, mobileNumber: user.mobileNumber },
//       process.env.JWT_SECRET,   
//       { expiresIn: "30d" }       // token expires in 30 days
//     );

//     // Return success response with token
//     res.json({
//       message: " Login successful",
//       token,
//       user: {
//         id: user._id,
//         mobileNumber: user.mobileNumber
//       }
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };





// // Set Trade Password (verify OTP + save tradePassword)
// const setTradePassword = async (req, res) => {
//   try {
//     const { otp, tradePassword } = req.body;
//     const { mobileNumber } = req.user; // JWT se aa raha hai

//     const user = await User.findOne({ mobileNumber });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // OTP checks
//     if (!user.otp) {
//       return res.status(400).json({ message: "OTP not generated or already used" });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (!user.otpExpires || Date.now() > user.otpExpires) {
//       return res.status(400).json({ message: "OTP has expired" });
//     }

//     // Save trade password
//     user.tradePassword = await bcrypt.hash(tradePassword, 10);
    

//     // Reset OTP
//     user.otp = null;
//     user.otpExpires = null;

//     await user.save();

//     res.json({ message: " Trade password set successfully" });
//   } catch (err) {
//     console.error("Trade password error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };






// module.exports = { generateOtp,generateTradePasswordOtp, register, login, setTradePassword,Transaction,  };






const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const jwt = require("jsonwebtoken");


// ---------------- Generate OTP ----------------
const generateOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    let user = await User.findOne({ mobileNumber });

    // Agar user exist nahi karta, to naya create karo
    if (!user) {
      user = new User({ mobileNumber });
    }

    // OTP generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    console.log(` OTP for ${mobileNumber}: ${otp}`);

    res.json({ message: "OTP generated successfully", otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ---------------- Generate OTP for Trade Password ----------------
const generateTradePasswordOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // valid 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(` Trade Password OTP for ${mobileNumber}: ${otp}`);

    res.json({ message: "OTP generated successfully", otp }); // ⚠️ dev mode me otp send
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ---------------- Register ----------------
const register = async (req, res) => {
  try {
    const { mobileNumber, password, invitationCode, otp } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ message: "User not found. Please generate OTP first." });
    }

    if (user.password) {
      return res.status(400).json({ message: "This number is already registered. Please login." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpires || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Save password and mark Active
    user.password = await bcrypt.hash(password, 10);
    user.invitationCode = invitationCode;
    user.otp = null;
    user.otpExpires = null;
    user.status = "Active";   // ✅ OTP verify hone ke baad user Active

    await user.save();

    res.json({ message: "Registration successful. User is now Active." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ---------------- Login ----------------
const login = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Validate input
    if (!mobileNumber || !password) {
      return res.status(400).json({ message: "Mobile number and password are required" });
    }

    // Find user
    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check status
    if (user.status !== "Active") {
      return res.status(403).json({ message: "User is inactive. Please complete registration." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, mobileNumber: user.mobileNumber },
      process.env.JWT_SECRET,
      { expiresIn: "30d" } // token expires in 30 days
    );

    // Return success response with token
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        status: user.status
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};


// ---------------- Set Trade Password ----------------
const setTradePassword = async (req, res) => {
  try {
    const { otp, tradePassword } = req.body;
    const { mobileNumber } = req.user; // JWT se aa raha hai

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // OTP checks
    if (!user.otp) {
      return res.status(400).json({ message: "OTP not generated or already used" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpires || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Save trade password
    user.tradePassword = await bcrypt.hash(tradePassword, 10);

    // Reset OTP
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({ message: "Trade password set successfully" });
  } catch (err) {
    console.error("Trade password error:", err);
    res.status(500).json({ error: err.message });
  }
};


// ---------------- Export ----------------
module.exports = {
  generateOtp,
  generateTradePasswordOtp,
  register,
  login,
  setTradePassword,
  Transaction,
};
