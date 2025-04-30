const express = require("express");
const router = express.Router(); // Creates a new router instance to handle routes
const User = require("../models/User"); // Imports the User model to interact with the database
const Division = require("../models/Division"); // Imports the Division model to handle divisions
const OU = require("../models/OUs"); // Imports the OU (Organizational Unit) model
const verifyToken = require("./VerifyToken"); // Imports middleware to verify the JWT token

// Middleware that checks if the user is an admin
const checkAdminRole = (req, res, next) => {
  const { role } = req.user; // Extracts the user's role from the decoded JWT

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." }); // Denies access if the user is not an admin
  }

  next(); // If the user is an admin, proceeds to the next middleware or route handler
};

// Gets all users with their assigned Divisions and OUs (Admin Only)
router.get("/admin-view", verifyToken, checkAdminRole, async (req, res) => {
  try {
    // Finds all users and populates their division and OU information
    const users = await User.find()
      .populate("division", "name") // Populates division field with the division names
      .populate("ou", "name"); // Populates OU field with the OU names
    res.json(users); // Returns the user data with populated division and OU
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handles errors with a 500 status code
  }
});

// Assigns a division to a user (Admin Only)
router.post("/:userId/assign-division", verifyToken, checkAdminRole, async (req, res) => {
  try {
    const { userId } = req.params; // Gets the user ID from the route parameters
    const { divisionId } = req.body; // Gets the division ID from the request body

    // Finds the user and the division in the database
    const user = await User.findById(userId);
    const division = await Division.findById(divisionId);

    if (!user || !division) {
      return res.status(404).json({ message: "User or Division not found" }); // Handles case where user or division is not found
    }

    user.division.push(division); // Assigns the division to the user's division array
    await user.save(); // Saves the updated user

    res.json({ message: "Division assigned successfully" }); // Returns a success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handles errors with a 500 status code
  }
});

// Removes division from a user (Admin Only)
router.delete("/:userId/remove-division", verifyToken, checkAdminRole, async (req, res) => {
  try {
    const { userId } = req.params; // Gets the user ID from the route parameters
    const { divisionId } = req.body; // Gets the division ID from the request body

    // Finds the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handles case where user is not found
    }

    // Removes the division from the user's division array
    user.division = user.division.filter((div) => div.toString() !== divisionId);
    await user.save(); // Save the updated user

    res.json({ message: "Division removed successfully" }); // Returns a success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handles errors with a 500 status code
  }
});

// Assigns an OU to a user (Admin Only)
router.post("/:userId/assign-ou", verifyToken, checkAdminRole, async (req, res) => {
  try {
    const { userId } = req.params; // Gets the user ID from the route parameters
    const { ouId } = req.body; // Gets the OU ID from the request body

    // Finds the user and the OU in the database
    const user = await User.findById(userId);
    const ou = await OU.findById(ouId);

    if (!user || !ou) {
      return res.status(404).json({ message: "User or OU not found" }); // Handles case where user or OU is not found
    }

    user.ou.push(ou); // Assigns the OU to the user's OU array
    await user.save(); // Saves the updated user

    res.json({ message: "OU assigned successfully" }); // Returns success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handles errors with a 500 status code
  }
});

// Removes OU from a user (Admin Only)
router.delete("/:userId/remove-ou", verifyToken, checkAdminRole, async (req, res) => {
  try {
    const { userId } = req.params; // Gets the user ID from the route parameters
    const { ouId } = req.body; // Gets the OU ID from the request body

    // Finds the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handles case where user is not found
    }

    // Removes the OU from the user's OU array
    user.ou = user.ou.filter((ou) => ou.toString() !== ouId);
    await user.save(); // Save the updated user

    res.json({ message: "OU removed successfully" }); // Returns success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); // Handles errors with a 500 status code
  }
});

module.exports = router; // Exports the router
