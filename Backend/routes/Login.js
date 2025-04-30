const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Endpoint: User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Extracts email and password from request body

  try {
    // Finds user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid login attempt. Please verify username and password." });
    }

    // Compares provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // Generates JWT token for authentication
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload containing user ID and role
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: "1h" } // Token expiration time
    );

    // Responds with token, user role, and user ID
    res.json({ token, role: user.role, userId: user._id });
  } catch (err) {
    console.error("[ERROR] Login failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; // Exports the router
