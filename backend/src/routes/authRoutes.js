const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../configs/db"); // PostgreSQL connection
require("dotenv").config();

const router = express.Router();

// 🔹 User Signup (Register)
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body; // Role optional

    try {
      const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userCheck.rows.length > 0) return res.status(400).json({ message: "Email already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
        [name, email, hashedPassword, role || "user"]
      );

      const token = jwt.sign(
        { userId: newUser.rows[0].id, role: newUser.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ user: newUser.rows[0], token });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);


// 🔹 User Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (user.rows.length === 0) return res.status(400).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      const token = jwt.sign(
        { userId: user.rows[0].id, role: user.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);


// 🔹 Export Routes
module.exports = router;
