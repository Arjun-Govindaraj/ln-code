const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Admin flag
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: "" },
  badges: [{ type: String }],
  completedLanguages: [{ type: String }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  quizHistory: [
    {
      language: String,
      level: String,
      score: Number,
      totalQuestions: Number,
      completedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);