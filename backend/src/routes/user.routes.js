const express = require("express");
const UserController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Secure route for logged-in users (user or admin)
router.get("/user-dashboard", verifyAccessToken, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", userId: req.user.userId, role: req.user.role });
});

// Protected User Routes (Require Authentication)
router.get("/:id", verifyAccessToken, UserController.getUserById);
router.get("/", verifyAccessToken, UserController.getAllUsers);

module.exports = router;
