const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

    verified: {
      type: Boolean,
      default: false,
    },
    email_verification_code: String,
    email_verification_expires: Date,
  },
  { timestamps: true }
);

employeeSchema.methods.generateToken = function () {
  try {
    const token = jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
    return token;
  } catch (error) {
    console.log("JWT generation error: ", error);
    return null;
  }
};

module.exports = mongoose.model("Employee", employeeSchema);
