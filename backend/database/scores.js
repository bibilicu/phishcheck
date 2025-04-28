const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoresSchema = new Schema({
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

  score: {
    type: Number,
    min: 0,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Scores", ScoresSchema);
