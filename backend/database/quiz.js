const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  // square brackets since there's array of multiple questions
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Questions",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Quiz", QuizSchema);
