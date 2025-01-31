const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

// Secure route for logged-in users (user or admin)
router.get("/user-dashboard", auth, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", userId: req.user.userId, role: req.user.role });
});

module.exports = router;
