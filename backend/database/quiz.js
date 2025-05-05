const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const section_options = {
  "Introduction to Phishing": ["True", "False"],
  Smishing: ["Legitimate", "Phish"],
  Email: ["Legitimate", "Phish"],
  Vishing: ["Legitimate", "Phish"],
};

const QuestionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
      // setting default to look in the mapping after section
      default: function () {
        return section_options[this.parent().section_type] || [];
      },
      // must validate to allow only allowed options
      validate: {
        validator: function (arr) {
          const opts = section_options[this.parent().section_type] || [];
          return (
            arr.length === opts.length && arr.every((o) => opts.includes(o))
          );
        },
        message: (props) =>
          `Invalid options for the "${
            props.instance.parent().section_type
          }" section.`,
      },
    },

    correct_answer: {
      type: String,
      required: true,
      // validate only correct answers listed in options list
      validate: {
        validator: function (val) {
          return this.options.includes(val);
        },
        message: (props) =>
          `"${props.value}" is not a valid option for the "${
            props.instance.parent().section_type
          }" section.`,
      },
    },

    explain_if_correct: String,
    explain_if_wrong: String,
    image_url: String,
  },
  { _id: true }
);

const QuizSchema = new Schema({
  section_type: {
    type: String,
    required: true,
    enum: Object.keys(section_options),
    unique: true,
  },

  questions: [QuestionSchema],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

QuizSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Quiz", QuizSchema);
