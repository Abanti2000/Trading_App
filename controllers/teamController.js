const mongoose = require('mongoose');

const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');

// Create new team
const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const team = await Team.create({ name, createdBy: req.user.id });
    res.status(201).json({ success: true, data: team });
  } catch (err) {
    console.error("Create Team Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get user's teams
const getUserTeams = async (req, res) => {
  try {
    const teams = await Team.find({ createdBy: req.user.id });
    res.json({ success: true, data: teams });
  } catch (err) {
    console.error("Get User Teams Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get team members with team name
const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ team: req.params.teamId })
      .populate("team", "name"); // sirf name field populate hogi

    res.json({ success: true, data: members });
  } catch (err) {
    console.error("Get Team Members Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Join a Team (self-join, role optional)
const joinTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    // check if already member
    const existingMember = await TeamMember.findOne({
      userId: req.user.id,
      team: teamId
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this team"
      });
    }

    // create new membership (role & name optional)
    const member = await TeamMember.create({
      userId: req.user.id,
      mobileNumber: req.user.mobileNumber,
      team: teamId
    });

    res.status(201).json({ success: true, data: member });
  } catch (err) {
    console.error("Join Team Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// Leave team
const leaveTeam = async (req, res) => {
  try {
    await TeamMember.findOneAndDelete({ userId: req.user.id, team: req.params.teamId });
    res.json({ success: true, message: "Left the team" });
  } catch (err) {
    console.error("Leave Team Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add member (admin action, role required)
const addTeamMember = async (req, res) => {
  try {
    const { name, mobileNumber, role, assignedAccounts } = req.body;
    const teamId = req.params.teamId;

    // validate required fields for admin add
    if (!name || !role) {
      return res.status(400).json({
        success: false,
        message: "Name and role are required to add a member"
      });
    }

    const existingMember = await TeamMember.findOne({ mobileNumber, team: teamId });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this team"
      });
    }

    const newMember = await TeamMember.create({
      name,
      mobileNumber,
      role,
      assignedAccounts,
      userId: req.user.id, // admin who added
      team: teamId
    });

    res.status(201).json({ success: true, data: newMember });
  } catch (err) {
    console.error("Add Team Member Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// Get team overview (all teams of the user)
const getTeamOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Get all teams created by this user
    const teams = await Team.find({ createdBy: userId });

    // 2️⃣ Get aggregated member stats
    const memberStats = await TeamMember.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          team: { $ne: null }
        } 
      },
      {
        $group: {
          _id: "$team",
          totalRecharge: { $sum: "$rechargeAmount" },
          myCommission: { $sum: "$commission" },
          validReferrals: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          totalReferrals: { $sum: 1 }
        }
      }
    ]);

    // 3️⃣ Map stats by teamId
    const statsMap = {};
    memberStats.forEach(s => {
      if (s._id) statsMap[s._id.toString()] = s;
    });

    // 4️⃣ Build overview
    const overview = teams.map(team => {
      const stats = statsMap[team._id.toString()] || {};
      return {
        teamName: team.name,
        totalRecharge: stats.totalRecharge || 0,
        myCommission: stats.myCommission || 0,
        referral: stats.validReferrals != null && stats.totalReferrals != null
          ? `${stats.validReferrals}/${stats.totalReferrals}`
          : "0/0"
      };
    });

    res.json({ success: true, data: overview });
  } catch (err) {
    console.error("Overview Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createTeam,
  getUserTeams,
  getTeamMembers,
  joinTeam,
  leaveTeam,
  addTeamMember,
  getTeamOverview
};
