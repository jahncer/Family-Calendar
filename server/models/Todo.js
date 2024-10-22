const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  content: String,
  completed: Boolean,
  priority: { type: String, enum: ['low', 'medium', 'high'] },
  dueDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Todo', TodoSchema);