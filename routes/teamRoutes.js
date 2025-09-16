const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createTeam,
  getUserTeams,
  getTeamMembers,
  joinTeam,
  leaveTeam,
  addTeamMember,
  getTeamOverview
} = require('../controllers/teamController');

// Routes
router.post('/create', auth, createTeam);
router.get('/user/teams', auth, getUserTeams);
router.get('/:teamId/members', auth, getTeamMembers);
router.get('/:teamId/overview', auth, getTeamOverview); // per team overview
router.get('/overview', auth, getTeamOverview);         // all teams overview
router.post('/:teamId/join', auth, joinTeam);
router.delete('/:teamId/leave', auth, leaveTeam);
router.post('/:teamId/add-member', auth, addTeamMember);


module.exports = router;
