const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

// Secure route only for admin users
router.get("/admin-dashboard", auth, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome, Admin!", userId: req.user.userId });
});

module.exports = router;
