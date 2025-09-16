const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },               // Team name, e.g., "Alpha Team"
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Team creator
}, { timestamps: true });                                // createdAt & updatedAt

module.exports = mongoose.model('Team', teamSchema);
