const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultsSchema = new Schema({
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

  questions_id: {
    type: Schema.Types.ObjectId,
    ref: "Quiz.sections.questions._id",
    required: true,
  },

  selected_answer: {
    type: String,
    required: true,
  },

  is_correct: {
    type: Boolean,
    required: true,
  },

  score: {
    type: Number,
    min: 0,
    required: true,
  },

  started_at: {
    type: Date,
    required: true,
  },

  answered_at: {
    type: Date,
    default: Date.now, // that shows how long it took the player to answer each question
  },

  time_spent: {
    type: Number,
    default: function () {
      return this.answered_at - this.started_at;
    },
  },
});

module.exports = mongoose.model("Results", ResultsSchema);
