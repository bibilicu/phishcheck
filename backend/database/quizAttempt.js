const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizAttemptSchema = new Schema({
  employee_id: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  quiz_id: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },

  started_at: {
    type: Date,
    default: Date.now,
  },

  completed_at: {
    type: Date,
  },

  total_score: {
    type: Number,
    default: 0,
  },

  // to count correct and wrong answers
  correct_count: {
    type: Number,
    default: 0,
  },

  wrong_count: {
    type: Number,
    default: 0,
  },

  attempt_number: {
    type: Number,
    default: 1,
  },

  abandoned: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
