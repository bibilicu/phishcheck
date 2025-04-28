const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mapping for options
const section_options = {
  "Introduction to Phishing": ["True", "False"],
  Smishing: ["Legitimate", "Phish"],
  Email: ["Legitimate", "Phish"],
  Vishing: ["Legitimate", "Phish"],
};

const QuestionsSchema = new Schema({
  section: {
    type: String,
    required: true,
    enum: Object.keys(section_options),
  },

  text: {
    type: String,
    required: true,
  },

  options: {
    type: [String],
    required: true,
    // setting default to look in the mapping after section
    default: function () {
      return section_options[this.section] || [];
    },
    // must validate to allow only allowed options
    validate: {
      validator: function (arr) {
        const opts = section_options[this.section] || [];
        return arr.length === opts.length && arr.every((o) => opts.includes(o));
      },
      message: (props) =>
        `Invalid options for the "${props.instance.section}" section.`,
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
        `"${props.value}" is not a valid option for the "${props.instance.section}" section.`,
    },
  },

  explain_if_correct: {
    type: String,
  },

  explain_if_wrong: {
    type: String,
  },

  image_url: {
    type: String,
  },
});

// overwriting options with mapping before saving
QuestionsSchema.pre("validate", function (next) {
  this.options = section_options[this.section] || [];
  next();
});

module.exports = mongoose.model("Questions", QuestionsSchema);
