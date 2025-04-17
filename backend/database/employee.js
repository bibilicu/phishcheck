const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      min: 8,
      max: 15,
    },

    phone_number: {
      type: Number,
      required: true,
    },

    training_status: {
      type: String,
      required: true,
      enum: ["3-6 months", "6-9 months", "+1 year", "Never"],
    },

    anonymous_id: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
