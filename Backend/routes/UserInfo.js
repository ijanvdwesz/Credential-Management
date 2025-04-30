const express = require("express");
const router = express.Router(); // Creates a new router instance to handle routes
const User = require("../models/User"); // Imports the User model to interact with the database
const verifyToken = require("./VerifyToken"); // Imports middleware to verify the JWT token

// Middleware that checks if the user is an admin
const checkAdminRole = (req, res, next) => {
  const { role } = req.user; // Extracts the user's role from the decoded JWT

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." }); // Denies access if the user is not an admin
  }

  next(); // If the user is an admin, proceeds to the next middleware or route handler
};

// Endpoint: Gets user info
router.get("/user-info", verifyToken, async (req, res) => {
  try {
    // Gets the userId from JWT token (attached by verifyToken middleware)
    const user = await User.findById(req.user.userId).populate("division"); // Populates division field

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Returns 404 if user is not found
    }

    // Maps divisions to return only the required fields ( _id and name)
    const divisions = user.division.map((d) => ({
      _id: d._id,
      name: d.name,
    }));

    // Returns the user's role and divisions
    res.json({
      role: user.role,
      divisions, // Returns only the _id and name of the divisions
    });
  } catch (err) {
    console.error("[ERROR] Failed to fetch user info:", err);
    res.status(500).json({ message: "Server error" }); // Handles server errors
  }
});

// Endpoint: Changes user role (Admins only)
router.patch("/change-role/:userId", verifyToken, checkAdminRole, async (req, res) => {
  const { userId } = req.params; // Gets the userId from the route parameters
  const { newRole } = req.body; // Gets the new role to assign to the user

  // Ensures the new role is valid
  const validRoles = ["normal_user", "division_manager", "admin"];
  if (!validRoles.includes(newRole)) {
    return res.status(400).json({ message: "Invalid role provided" }); // Return 400 if the role is invalid
  }

  try {
    // Fetches the current user from the token
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." }); // Denies access if current user is not an admin
    }

    // Fetches the user whose role is to be updated
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" }); // Returns 404 if the user is not found
    }

    // Updates the user's role
    userToUpdate.role = newRole;
    await userToUpdate.save(); // Saves the updated user

    res.status(200).json({
      message: "User role updated successfully",
      updatedUser: {
        id: userToUpdate._id,
        name: userToUpdate.name,
        email: userToUpdate.email,
        role: userToUpdate.role,
      }, // Returns the updated user info
    });
  } catch (err) {
    console.error("[ERROR] Failed to change user role:", err);
    res.status(500).json({ message: "Server error" }); // Handles server errors
  }
});

// Endpoint: Gets user info
router.get("/user-info", verifyToken, async (req, res) => {
  try {
    // Gets the userId from JWT token
    const user = await User.findById(req.user.userId).populate("ou"); // Populates OU field

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Returns 404 if user is not found
    }

    // Maps divisions to return only the required fields (_id and name)
    const divisions = user.ou.divisions.map((d) => ({
      _id: d._id,
      name: d.name,
    }));

    // Returns the user's role, OU information, and associated divisions
    res.json({
      role: user.role,
      ouId: user.ou._id,
      divisions,
    });
  } catch (err) {
    console.error("[ERROR] Failed to fetch user info:", err);
    res.status(500).json({ message: "Server error" }); // Handles server errors
  }
});

module.exports = router; // Exports the router
