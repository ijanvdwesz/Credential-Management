// Imports mongoose to define the schema
const mongoose = require("mongoose");

// Defines the Division schema
const divisionSchema = new mongoose.Schema({
  // Name of the division: required and stored as a string
  name: { 
    type: String, 
    required: true, 
    trim: true, // Ensures no leading or trailing spaces are stored
  },

  // References to the Organizational Unit (OU) this division belongs to
  ou: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "OU", // Refers to the "OU" model in MongoDB
    required: true, // Every division must be linked to an OU
  },

  // List of credentials associated with this division
  credentials: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Credential", // Refers to the "Credential" model
  }],
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically(just incase)
});

// Creates the Division model from the schema
const Division = mongoose.model("Division", divisionSchema);

// Exports the model
module.exports = Division;
