// Imports mongoose to define the schema
const mongoose = require("mongoose");

// Defines the Organizational Unit (OU) schema
const ouSchema = new mongoose.Schema({
  // Name of the organizational unit: required and stored as a string
  name: { 
    type: String, 
    required: true, 
    trim: true, // Ensures no leading or trailing spaces are stored
    unique: true, // Prevents duplicate OU names
  },

  // List of divisions that belong to this OU
  divisions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Division", // References the "Division" model
  }],
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// Creates the OU model from the schema
const OU = mongoose.model("OU", ouSchema);

// Exports the model
module.exports = OU;
