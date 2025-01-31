
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes"); // Import auth routes
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes

// Basic welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the WealthWise project!");
});

app.use("/api/auth", authRoutes); // Use auth routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


