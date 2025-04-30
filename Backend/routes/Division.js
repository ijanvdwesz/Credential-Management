const express = require("express");
const router = express.Router();
const Division = require("../models/Division");
const verifyToken = require("./VerifyToken");

// Endpoint: Gets all divisions
router.get("/", verifyToken, async (req, res) => {
  try {
    // Fetches all divisions and populates their associated organizational unit (OU)
    const divisions = await Division.find().populate("ou");
    res.json(divisions);
  } catch (err) {
    console.error("[ERROR] Failed to fetch divisions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint: Creates a new division
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, ou } = req.body;
    
    // Creates a new division document
    const division = new Division({ name, ou });
    await division.save();
    res.status(201).json(division);
  } catch (err) {
    console.error("[ERROR] Failed to create division:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint: Gets divisions by OU
router.get("/divisions-by-ou", verifyToken, async (req, res) => {
  try {
    // Gets the OU ID from the query parameter
    const { ouId } = req.query;
    
    if (!ouId) {
      return res.status(400).json({ message: "OU ID is required" });
    }

    // Fetches divisions that belong to the specified OU
    const divisions = await Division.find({ ou: ouId });

    res.json(divisions);
  } catch (err) {
    console.error("[ERROR] Failed to fetch divisions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Endpoint: Gets divisions by OU

router.get("/divisions-by-ou", verifyToken, async (req, res) => {
  try {
    const { ouId } = req.query; // Gets OU ID from query params

    if (!ouId) {
      return res.status(400).json({ message: "OU ID is required" });
    }

    // Fetches the organizational unit and populates its divisions
    const ou = await OU.findById(ouId).populate("divisions");

    if (!ou) {
      return res.status(404).json({ message: "OU not found" });
    }

    // Sends divisions data to the frontend
    res.json(ou.divisions); // Returns only divisions
  } catch (err) {
    console.error("[ERROR] Failed to fetch divisions by OU:", err);
    res.status(500).json({ message: "Server error" });
  }
});
//Exports the router
module.exports = router;
