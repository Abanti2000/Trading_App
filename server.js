const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");

const walletRoutes = require("./routes/walletRoutes");

const teamRoutes = require('./routes/teamRoutes');
const withdrawRoutes = require("./routes/withdrawRoutes");



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



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
