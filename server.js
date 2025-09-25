const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const teamRoutes = require('./routes/teamRoutes');
const withdrawRoutes = require("./routes/withdrawRoutes");
const messageRoutes = require("./routes/messageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const questRoutes = require("./routes/questRoutes");
const questRewardRoutes = require("./routes/questRewardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const spinRoutes = require("./routes/spinRoutes");




dotenv.config();
const app = express();

app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use('/api/teams', teamRoutes);
app.use("/api/withdrawal", withdrawRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/quest-rewards", questRewardRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/payments", paymentRoutes);
app.use("/api", spinRoutes);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
