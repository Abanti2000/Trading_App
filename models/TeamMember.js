const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  //  Optional for self-join (Admin can override when adding member)
  name: { type: String },

  //  Always required (unique identifier per team)
  mobileNumber: { type: String, required: true },

  //  Optional for self-join, required when admin adds member
  role: { type: String, enum: ['broker', 'analyst', 'support'] },

  //  Extra info
  assignedAccounts: [{ type: String }],

  //  Who joined / who added
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  //  Reference to Team
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },

  //  Financial stats
  rechargeAmount: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },

  //  Status
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }

}, { timestamps: true });

//  Compound unique index: prevent duplicate member per team
teamMemberSchema.index({ userId: 1, team: 1 }, { unique: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
