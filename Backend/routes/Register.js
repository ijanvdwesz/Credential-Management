const express = require("express");
const router = express.Router(); // Creates a new instance of the router to handle routes
const User = require("../models/User"); // Imports the User model to interact with the database
const jwt = require("jsonwebtoken"); // Imports jsonwebtoken to generate JWT tokens

// Registration Endpoint
router.post('/register', async (req, res) => {
  // Destructures the user details (name, email, password, role) from the request body
  const { name, email, password, role } = req.body;

  try {
    // Checks if a user with the same email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' }); // If the user exists, returns a 400 error
    }

    // Creates a new user instance with the provided details
    const newUser = new User({
      name,
      email,
      password, // Stores the password
      role: role || 'normal_user', // If no role is provided, defaults to 'normal_user'
    });

    // Saves the new user to the database
    await newUser.save();

    // Generates a JWT token with the user's ID and role
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET, // Uses the JWT secret from environment variables
      { expiresIn: '1h' } // Sets the token to expire in 1 hour
    );

    // Responds with the JWT token and the new user's ID
    res.status(201).json({ token, userId: newUser._id });
  } catch (err) {
    // Logs any errors and respond with a 500 status code for server errors
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; // Exports the router
