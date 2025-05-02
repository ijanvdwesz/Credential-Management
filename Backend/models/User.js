// Imports required modules
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Defines the User schema
const userSchema = new mongoose.Schema(
  {
    // User's full name, required field
    name: { 
      type: String, 
      required: true, 
      trim: true // Ensures no leading/trailing spaces
    },

    // User's email, must be unique
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, // Avoids accidental spaces
      lowercase: true, // Ensures consistency in storage
    },

    // Hashed password, required
    password: { 
      type: String, 
      required: true 
    },

    // Role-based access control
    role: { 
      type: String, 
      enum: ["normal_user", "division_manager", "admin"], // Allowed roles
      required: true,
      default: "normal_user", // Ensures a default role for new users
    },

    // Reference to Organizational Units (OU) the user belongs to
    ou: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "OU" 
    }],  

    // Reference to Divisions the user is assigned to
    division: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Division" 
    }],
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` timestamps
  }
);

// Middleware: Hashes the password before saving the user to the database
userSchema.pre("save", async function (next) {
  // Only hashes the password if it has been modified (or is new since extinging passwords are hashed already)
  if (!this.isModified("password")) return next();

  try {
    // Hash the password with a salt round of 10(determines how many times the hashing algorithm runs)
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err); // Passes errors to the next middleware
  }
});

// Creates the User model from the schema
const User = mongoose.model("User", userSchema);

// Exports the User model
module.exports = User;
