// Imports mongoose to define the schema and model
const mongoose = require("mongoose");

// Defines the Credential schema
const credentialSchema = new mongoose.Schema({
  // Username field:  
  username: { 
    type: String, // must be a string
    required: true,// and is required for every credential 
    trim: true, // Ensures no leading/trailing whitespace is saved in the database
  },
  
  // Password field:
  password: { 
    type: String, // must be a string,
    required: true, // is required for every credential,
    minlength: 6, // And Enforces a minimum length for security
  },

  // Description field:
  description: { 
    type: String,  // must be a string,
    required: true, // is required for every credential
    trim: true, // Ensures no extra spaces are stored in the database
  },

  // Place field: specifies where the credential is used
  place: { 
    type: String, // must be a string 
    required: true, // required for every credential
    trim: true, // Removes unwanted spaces
  },

  // Reference to Division model: used to link this credential to a specific division
  division: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Division", 
    required: true, // is required for every credentia
  },
}, {
  timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically(which is not used currently)
});

// Creates the Credential model from the schema
const Credential = mongoose.model("Credential", credentialSchema);

// Exports the model
module.exports = Credential;
