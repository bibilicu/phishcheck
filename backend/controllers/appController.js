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
  codeGenerator,
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
    const error = {};

    if (!email) {
      error.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      error.email = "Invalid email format.";
    }

    if (Object.keys(error).length > 0) {
      return res.status(400).json({ error });
    }

    const user = await employee.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: { email: "User not found." } });
    }

    const resetCode = codeGenerator();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 10 minutes

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
      html: `<p>Hello ${user.anonymous_id},</p></br>
      <p>Here is your password reset code: <strong>${resetCode}</strong></p>
      <p>The code is available for 1 hour.</p></br>
      <p>Best regards, the PhishCheck team.</p>`,
    });

    return res.status(200).json({
      message: "Reset code sent to your email, please check your inbox.",
    }); // this would be a page redirection
  } catch (error) {
    console.log("Send code error: ", error);
    return res.status(500).json({ error: "Could not send reset code." });
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

    const error = {};

    // missing fields
    if (!full_name?.trim()) {
      error.full_name = "Full Name is required.";
    }
    if (!department?.trim()) {
      error.department = "Department is required.";
    }
    if (!email?.trim()) {
      error.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      error.email = "Invalid email format";
    }

    if (!password?.trim()) {
      error.password = "Password is required.";
    }

    if (!confirm_password?.trim()) {
      error.confirm_password = "Please confirm your password.";
    }

    if (password !== confirm_password) {
      error.confirm_password = "Passwords do not match.";
    }

    if (!training_status) {
      error.training_status =
        "Please state the last time you underwent a training.";

      // email format
    }

    // password strength

    if (password) {
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
        error.password = passwordError.join(" ");
      }
    }

    if (Object.keys(error).length > 0) {
      return res.status(400).json({ error });
    }

    // verifying if user already exists
    const existingUser = await employee.findOne({ email });
    if (existingUser) {
      return res.status(500).json({
        error: {
          email: "This user has already been registered.",
        },
      });
    }

    const hashedPassword = await hashPassword(password);

    const anonymous_id = await anonymousUniqueName();

    const verificationCode = codeGenerator();
    const codeExpires = new Date(Date.now() + 60 * 60 * 1000);

    const user = new employee({
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
      subject: "Account Verification Code",
      html: `<p>Hello ${user.anonymous_id},</p></br>
      <p>Here is your verification code: <strong>${verificationCode}</strong></p>
      <p>The code is available for 1 hour.</p></br>
      <p>Best regards, the PhishCheck team.</p>`,
    });

    await user.save();
    return res.status(201).json({
      message: "User created successfully. Please verify your email",
      email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error in registration API." });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const error = {};

    if (!verificationCode) {
      error.verificationCode = "Verification code is required.";
    }

    if (Object.keys(error).length > 0) {
      return res.status(400).json({ error });
    }

    const user = await employee.findOne({
      email_verification_code: verificationCode,
    });
    if (!user) {
      return res.status(404).json({
        error: {
          email: "User not found.",
        },
      });
    }

    if (
      user.email_verification_code !== verificationCode ||
      new Date() > user.email_verification_expires
    ) {
      error.verificationCode = "Invalid or expired code.";
    }

    if (Object.keys(error).length > 0) {
      return res.status(400).json({ error });
    }

    // success after being verified
    user.verified = true;
    user.email_verification_code = null;
    user.email_verification_expires = null;
    const token = user.generateToken();
    await user.save();

    return res.status(201).json({
      message: "User verified successfully.",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong with verification" });
  }
};

// login endpoint
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const error = {};

    if (!email?.trim()) {
      error.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      error.email = "Invalid email format.";
    }

    if (!password?.trim()) {
      error.password = "Password is required.";
    }

    if (Object.keys(error).length > 0) {
      return res.status(400).json({ error });
    }

    const user = await employee.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: {
          email: "User has not been found.",
        },
      });
    }

    if (!user.verified) {
      return res.status(401).json({
        error: {
          email: "Please verify your email first.",
        },
      });
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        error: {
          password: "Incorrect email or password.",
        },
      });
    }
    //success
    const token = user.generateToken();
    return res.status(200).json({
      token,
      user,
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
    const { resetCode, password, confirm_password } = req.body;
    const error = {};

    if (!resetCode?.trim()) {
      error.resetCode = "The code is required.";
    }
    if (!password?.trim()) {
      error.password = "Password is required.";
    }

    if (!confirm_password.trim()) {
      error.confirm_password = "Please confirm your password.";
    }

    if (password !== confirm_password) {
      error.confirm_password = "Passwords do not match.";
    }

    if (password) {
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
        error.password = passwordError.join(" ");
      }
    }

    if (Object.keys(error).length > 0) {
      return res.status(400).json({ error });
    }

    const user = await employee.findOne({ reset_code: resetCode });

    if (!user) {
      return res.status(400).json({
        error: {
          reset_code: "Invalid code.",
        },
      });
    }

    if (user.reset_code !== resetCode) {
      return res.status(400).json({
        error: {
          reset_code: "Invalid code.",
        },
      });
    }

    if (user.reset_code_expires < new Date()) {
      return res.status(400).json({
        error: {
          reset_code: "The code has expired.",
        },
      });
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.reset_code = null;
    user.reset_code_expires = null;
    await user.save();
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
