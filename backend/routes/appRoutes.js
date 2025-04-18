const express = require("express");

const router = express.Router();
const {
  createAccount,
  Login,
  authenticate,
  verifyEmail,
  sendCode,
  verifyCode,
  passwordReset,
} = require("../controllers/appController");

// routes
router.post("/create-account", createAccount);

router.post("/login", Login);

router.post("/verify-email", verifyEmail);

// for testing purposes
router.get("/home", authenticate, (req, res) => {
  res
    .status(200)
    .json({ message: `Hello, ${req.user.email}!`, user: req.user });
});

router.post("/send-code", sendCode);

router.post("/verify-code", verifyCode);

router.post("/password-reset", passwordReset);

module.exports = router;
