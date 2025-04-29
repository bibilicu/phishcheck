const express = require("express");

const router = express.Router();
const {
  createAccount,
  Login,
  authenticate,
  verifyEmail,
  sendCode,
  passwordReset,
} = require("../controllers/appController");

const { getQuestions } = require("../controllers/questionsController");

// routes
router.post("/create-account", createAccount);

router.post("/login", Login);

router.post("/verify-email", verifyEmail);

// for testing purposes
router.get("/home", authenticate, (req, res) => {
  res.json({
    message: `Welcome!, ${req.user.anonymous_id}`,
    user: req.user,
  });
});

router.post("/send-code", sendCode);

router.post("/password-reset", passwordReset);

router.get("/questions", getQuestions);

module.exports = router;
