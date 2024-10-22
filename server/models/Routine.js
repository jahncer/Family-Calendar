const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
  name: String,
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'] },
  time: String,
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  description: String,
  daysOfWeek: [String],
  reminders: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Routine', RoutineSchema);