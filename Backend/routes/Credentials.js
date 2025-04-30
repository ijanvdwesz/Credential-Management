const express = require("express");
const router = express.Router();
const Credential = require("../models/Credential");
const Division = require("../models/Division");
const User = require("../models/User");
const verifyToken = require("./VerifyToken");

// Middleware that checks if the user is an admin or division manager
const checkManagerRole = (req, res, next) => {
  const { role } = req.user;

  if (role !== "admin" && role !== "division_manager") {
    return res.status(403).json({ message: "Access denied. Admins and Division Managers only." });
  }

  next();
};

// Endpoint: Create credentials (POST /api/credentials)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { username, password, description, place, division } = req.body;

    // Validates required fields
    if (!username || !password || !division || !place) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Checks if the specified division exists
    const divisionDoc = await Division.findById(division);
    if (!divisionDoc) {
      return res.status(404).json({ message: "Division not found" });
    }

    // Creates a new credential entry
    const newCredential = new Credential({
      username,
      password,
      description,
      place,
      division: divisionDoc._id,
    });

    // Saves the credential to the database
    await newCredential.save();
    res.status(201).json(newCredential);
  } catch (err) {
    console.error("[ERROR] Failed to create credential:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint: Gets credentials for a specific division (GET /api/divisions/credentials)
router.get("/credentials", verifyToken, async (req, res) => {
  try {
    const { divisionId } = req.query;

    // Ensures divisionId is provided
    if (!divisionId) {
      return res.status(400).json({ message: "Division ID is required" });
    }

    // Checks if the division exists
    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    // Fetches credentials associated with the division
    const credentials = await Credential.find({ division: divisionId }).populate("division", "name");

    if (!credentials.length) {
      return res.status(404).json({ message: "No credentials found for the specified division" });
    }

    res.json(credentials);
  } catch (err) {
    console.error("[ERROR] Failed to fetch credentials:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint: Gets credentials for divisions the logged-in user belongs to (GET /api/credentials)
router.get("/", verifyToken, async (req, res) => {
  try {
    // Fetches user and populates associated divisions
    const user = await User.findById(req.user.userId).populate("division");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Gets the list of division IDs the user belongs to
    const divisionIds = user.division.map((d) => d._id);

    // Fetches credentials for the user's divisions
    const credentials = await Credential.find({ division: { $in: divisionIds } }).populate("division", "name");

    if (!credentials.length) {
      return res.status(404).json({ message: "No credentials found for your divisions" });
    }

    res.json(credentials);
  } catch (err) {
    console.error("[ERROR] Failed to fetch credentials:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint: Updates a specific credential (PATCH /api/credentials/:id)
router.patch("/:id", verifyToken, checkManagerRole, async (req, res) => {
  try {
    const { username, password, description, place } = req.body;

    const updates = {}; // Object that holds the fields to be updated

    // Only includes provided fields in the update
    if (username) updates.username = username;
    if (password) updates.password = password;
    if (description) updates.description = description;
    if (place) updates.place = place;

    // Ensures at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "At least one field must be provided to update" });
    }

    // Finds the credential by ID
    const credential = await Credential.findById(req.params.id);
    if (!credential) {
      return res.status(404).json({ message: "Credential not found" });
    }

    // Applies the updates to the credential
    Object.assign(credential, updates);

    // Saves the updated credential
    await credential.save();

    res.json(credential);
  } catch (err) {
    console.error("[ERROR] Failed to update credential:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Exports the router 
module.exports = router;
