const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  avatar: String,
  googleCalendarConnected: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);