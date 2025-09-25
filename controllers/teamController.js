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
// Get team members with masked mobile, status, and joined date

const getTeamMembers = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const members = await TeamMember.find({ team: teamId })
      .populate("team", "name");

    // Referral calculation
    const totalReferrals = members.length;
    const validReferrals = members.filter(m => m.status === "active").length;

    const formatted = members.map(m => ({
      mobile: m.mobileNumber.replace(/(\d{2})\d+(\d{2})/, "$1*****$2"), // mask mobile
      joinedAt: m.createdAt,  // format frontend pe kar lena
      status: m.status === "active" ? "Active" : "Not Active",
      recharge: m.rechargeAmount || 0,
      commission: m.commission || 0
    }));

    res.json({
      success: true,
      data: {
        referral: `${validReferrals}/${totalReferrals}`, // 👈 yeh upar dikhane ke liye
        members: formatted
      }
    });
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
// const getTeamOverview = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // 1 Get all teams created by this user
//     const teams = await Team.find({ createdBy: userId });

//     // 2 Get aggregated member stats
//     const memberStats = await TeamMember.aggregate([
//       { 
//         $match: { 
//           userId: new mongoose.Types.ObjectId(userId),
//           team: { $ne: null }
//         } 
//       },
//       {
//         $group: {
//           _id: "$team",
//           totalRecharge: { $sum: "$rechargeAmount" },
//           myCommission: { $sum: "$commission" },
//           validReferrals: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
//           totalReferrals: { $sum: 1 }
//         }
//       }
//     ]);

//     // 3 Map stats by teamId
//     const statsMap = {};
//     memberStats.forEach(s => {
//       if (s._id) statsMap[s._id.toString()] = s;
//     });

//     // 4 Build overview
//     const overview = teams.map(team => {
//       const stats = statsMap[team._id.toString()] || {};
//       return {
//         teamName: team.name,
//         totalRecharge: stats.totalRecharge || 0,
//         myCommission: stats.myCommission || 0,
//         referral: stats.validReferrals != null && stats.totalReferrals != null
//           ? `${stats.validReferrals}/${stats.totalReferrals}`
//           : "0/0"
//       };
//     });

//     res.json({ success: true, data: overview });
//   } catch (err) {
//     console.error("Overview Error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };




const getTeamOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { teamId } = req.params;

    // 1. Get teams (all or a single team)
    let teamFilter = { createdBy: userId };
    if (teamId) teamFilter._id = teamId;

    const teams = await Team.find(teamFilter);
    const teamIds = teams.map(t => t._id);

    // 2. Aggregate team stats: total recharge & members
    const teamStats = await TeamMember.aggregate([
      { $match: { team: { $in: teamIds } } },
      {
        $group: {
          _id: "$team",
          totalRecharge: { $sum: "$rechargeAmount" },
          totalMembers: { $sum: 1 },
          activeMembers: { $sum: { $cond: [{ $gt: ["$rechargeAmount", 0] }, 1, 0] } }
        }
      }
    ]);

    // Map stats by teamId
    const statsMap = {};
    teamStats.forEach(s => {
      statsMap[s._id.toString()] = s;
    });

    // 3. Aggregate current user’s commission per team
    const myCommissions = await TeamMember.aggregate([
      { $match: { team: { $in: teamIds }, userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$team",
          myCommission: { $sum: "$commission" }
        }
      }
    ]);

    const myCommissionMap = {};
    myCommissions.forEach(c => {
      myCommissionMap[c._id.toString()] = c.myCommission;
    });

    // 4. Build overview ensuring referral is always included
    const overview = teams.map(team => {
      const stats = statsMap[team._id.toString()] || {};
      const totalRecharge = stats.totalRecharge || 0;
      const myCommission = myCommissionMap[team._id.toString()] || 0;

      const totalMembers = stats.totalMembers != null ? stats.totalMembers : 3; // default 3 members
      const activeMembers = stats.activeMembers != null ? stats.activeMembers : 0;

      return {
        teamName: team.name,
        totalRecharge,
        myCommission,
        referral: `${activeMembers}/${totalMembers}`,
        commissionRate: totalRecharge > 0 ? ((myCommission / totalRecharge) * 100).toFixed(2) + "%" : "0%"
      };
    });

    // 5. Summary – total commission rate
    const totalRechargeSum = teamStats.reduce((acc, s) => acc + (s.totalRecharge || 0), 0);
    const totalCommissionSum = Object.values(myCommissionMap).reduce((acc, c) => acc + (c || 0), 0);

    const summary = {
      totalCommissionRate: totalRechargeSum > 0 ? ((totalCommissionSum / totalRechargeSum) * 100).toFixed(2) + "%" : "0%"
    };

    res.json({ success: true, data: { summary, teams: overview } });

  } catch (err) {
    console.error("Overview Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getTeamOverview };

module.exports = { getTeamOverview };

module.exports = {
  createTeam,
  getUserTeams,
  getTeamMembers,
  joinTeam,
  leaveTeam,
  addTeamMember,
  getTeamOverview
};
