// const dbConnect = require("./config/db");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// breaking passwordRegex down for live feedback
const passwordRegex = {
  upperCase: /[A-Z]/,
  lowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialCharacter: /[#?!@$%^&*-]/,
  hasMinLength: /.{8,}/,
  hasMaxLength: /^.{0,15}$/,
};

const employee = require("../database/employee");
const { hashPassword } = require("../helpers/authHelper");

// signup endpoint
const createAccount = async (req, res) => {
  try {
    const {
      full_name,
      department,
      email,
      phone_number,
      password,
      training_status,
    } = req.body;

    // missing fields
    if (!full_name?.trim()) {
      return res.status(400).json({ error: "Full Name is required." });
    }
    if (!department?.trim()) {
      return res.status(400).json({ error: "Department is required." });
    }
    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!phone_number?.trim()) {
      return res.status(400).json({ error: "Phone number is required." });
    }
    if (!password?.trim()) {
      return res.status(400).json({ error: "Password is required." });
    }
    if (!training_status) {
      return res.status(400).json({
        error: "Please state the last time you undergone a training.",
      });

      // email format
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // password strength

    const passwordError = [];

    if (!passwordRegex.upperCase.test(password)) {
      passwordError.push("At least one uppercase letter.");
    }

    if (!passwordRegex.lowerCase.test(password)) {
      passwordError.push("At least one lowercase letter.");
    }

    if (!passwordRegex.hasSpecialCharacter.test(password)) {
      passwordError.push("At least one special character.");
    }

    if (!passwordRegex.hasNumber.test(password)) {
      passwordError.push("At least one number.");
    }

    if (!passwordRegex.hasMinLength.test(password)) {
      passwordError.push("Password must be at least 8 characters.");
    }

    if (!passwordRegex.hasMaxLength.test(password)) {
      passwordError.push("Password cannot be longer than 15 characters.");
    }

    if (passwordError.length > 0) {
      return res.status(400).json({ error: passwordError.join(" ") });
    }

    // verifying if user already exists
    const existingEmployee = await employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(500)
        .json({ error: "This user has already been registered." });
    }

    const hashedPassword = await hashPassword(password);

    const employeeUser = new employee({
      full_name,
      department,
      email,
      phone_number,
      password: hashedPassword,
      training_status,
    });

    await employeeUser.save();

    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error in registration API." });
  }
};

// login endpoint
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!password?.trim()) {
      return res.status(400).json({ error: "Password is required." });
    }
    // wrong email and password later on with DB
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error in login API." });
  }
};

module.exports = { createAccount, Login };

//it works B)
