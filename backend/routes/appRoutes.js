const express = require("express");

const router = express.Router();
const { createAccount } = require("../controllers/appController");
const { Login } = require("../controllers/appController");

// routes
router.post("/create-account", createAccount);

router.post("/login", Login);

// router.get("", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Welcome to PhishCheck! Hi there!",
//   });
// });

module.exports = router;
