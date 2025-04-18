const express = require("express");

const router = express.Router();
const {
  createAccount,
  Login,
  authenticate,
} = require("../controllers/appController");

// routes
router.post("/create-account", createAccount);

router.post("/login", Login);

// for testing purposes
router.get("/home", authenticate, (req, res) => {
  res
    .status(200)
    .json({ message: `Hello, ${req.user.email}!`, user: req.user });
});

module.exports = router;
