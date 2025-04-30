const express = require("express");
const router = express.Router();
const OU = require("../models/OUs");
const verifyToken = require("./VerifyToken"); // Middleware that verifies JWT token

// Middleware that checks if the user is an admin
const checkAdminRole = (req, res, next) => {
  const { role } = req.user; // Gets the user's role from the decoded JWT

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next(); // Proceeds to the next middleware or route handler
};

// Endpoint: Gets all OUs (Organizational Units)
router.get("/", verifyToken, checkAdminRole, async (req, res) => {
  try {
    // Fetches all Organizational Units from the database
    const ous = await OU.find();
    res.json(ous);
  } catch (err) {
    console.error("[ERROR] Failed to fetch OUs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; // Exports the router
