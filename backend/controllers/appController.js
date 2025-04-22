const jwt = require("jsonwebtoken");
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

const {
  hashPassword,
  anonymousUniqueName,
  comparePassword,
  transporter,
} = require("../helpers/authHelper");

//verifyToken endpoint - to verify token
const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing or invalid" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ user: decodedToken });
  } catch (error) {
    console.log("Token verification failed: ", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// send the code for password reset (as requested via email)
const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const employeeUser = await employee.findOne({ email });
    if (!employeeUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await employee.updateOne(
      { email },
      {
        $set: {
          reset_code: resetCode,
          reset_code_expires: expiresAt,
        },
      }
    );

    await transporter.sendMail({
      from: "filofteabi@gmail.com",
      to: email,
      subject: "Password Reset Code",
      html: `<p>Hello ${employeeUser.anonymous_id},</p></br>
      <p>Here is your password reset code: <strong>${resetCode}</strong></p>
      <p>The code is available for only 10 minutes.</p></br>
      <p>Best regards, the PhishCheck team.</p>`,
    });

    return res.status(200).json({
      message: "Reset code sent to your email, please check your inbox.",
    }); // this would be a page redirection
  } catch (error) {
    console.log("Send code error: ", error);
    return res.status(500).json({ error: "Could not send reset code" });
  }
};

// signup endpoint
const createAccount = async (req, res) => {
  try {
    const {
      full_name,
      department,
      email,
      password,
      confirm_password,
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
    if (!password?.trim() || !confirm_password.trim()) {
      return res.status(400).json({ error: "Password is required." });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
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

    const anonymous_id = await anonymousUniqueName();

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const codeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const employeeUser = new employee({
      full_name,
      department,
      email,
      password: hashedPassword,
      training_status,
      anonymous_id,
      email_verification_code: verificationCode,
      email_verification_expires: codeExpires,
    });

    await transporter.sendMail({
      from: "filofteabi@gmail.com",
      to: email,
      subject: "Account Verification",
      html: `<p>Hello ${employeeUser.anonymous_id},</p></br>
      <p>Here is your verification code: <strong>${verificationCode}</strong></p>
      <p>The code is available for 1 hour.</p></br>
      <p>Best regards, the PhishCheck team.</p>`,
    });

    await employeeUser.save();
    return res.status(201).json({
      message: "User created successfully. Please verify your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error in registration API." });
  }
};

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  const employeeUser = await employee.findOne({ email });
  if (!employeeUser) {
    return res.status(404).json({ error: "User not found." });
  }

  if (
    employeeUser.email_verification_code !== verificationCode ||
    new Date() > employeeUser.email_verification_expires
  ) {
    return res.status(400).json({ error: "Invalid or expired code." });
  }

  // success after being verified
  employeeUser.verified = true;
  employeeUser.email_verification_code = null;
  employeeUser.email_verification_expires = null;
  await employeeUser.save();

  return res.status(201).json({
    message: "User verified successfully.",
  });
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

    const existingEmployee = await employee.findOne({ email });
    if (!existingEmployee) {
      return res.status(400).json({ error: "User has not been found." });
    }

    if (!existingEmployee.verified) {
      return res.status(401).json({ error: "Please verify your email first." });
    }

    const passwordMatch = await comparePassword(
      password,
      existingEmployee.password
    );
    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect email or password." });
    }
    //success
    const token = existingEmployee.generateToken();
    return res.status(200).json({
      message: `Login successful, welcome ${existingEmployee.anonymous_id}`,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error in login API." });
  }
};

// to protect endpoints
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token.");
  }
};

// update password if forgotten
const passwordReset = async (req, res) => {
  try {
    const { email, resetCode, password, confirm_password } = req.body;
    const existingEmployee = await employee.findOne({ email });
    if (!password?.trim() || !confirm_password.trim()) {
      return res.status(400).json({ error: "Password is required." });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

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

    if (!existingEmployee || existingEmployee.reset_code !== resetCode) {
      return res.status(400).json({ error: "Invalid code." });
    }

    if (existingEmployee.reset_code_expires < new Date()) {
      return res.status(400).json({ error: "The code has expired." });
    }

    const hashedPassword = await hashPassword(password);
    (existingEmployee.password = hashedPassword),
      (existingEmployee.reset_code = null),
      (existingEmployee.reset_code_expires = null),
      await existingEmployee.save();
    return res.status(200).json({
      message: "Password has been successfully reset. Please proceed to login.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while resetting password." });
  }
};

module.exports = {
  createAccount,
  Login,
  verifyToken,
  authenticate,
  verifyEmail,
  sendCode,
  passwordReset,
};

//it works B)
