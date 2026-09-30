const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  language: { type: String, required: true }, // e.g., 'python', 'javascript', 'html', 'java', 'c'
  level: { type: String, required: true },    // e.g., 'beginner', 'intermediate', 'veteran'
  question: { type: String, required: true },
  code: { type: String, default: "" },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true },
  explanation: { type: String, required: true }
});

module.exports = mongoose.model('Question', QuestionSchema);