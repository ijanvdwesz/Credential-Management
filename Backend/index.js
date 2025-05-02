const express = require("express");
const mongoose = require("mongoose");
const registerRoutes = require("./routes/Register");
const loginRoutes = require("./routes/Login");
const userInfoRoutes = require("./routes/UserInfo");
const divisionRoutes = require("./routes/Division");
const credentialsRoutes = require("./routes/Credentials");
const userAssignmentsRoutes = require("./routes/userAssignments");
const ousRoutes = require("./routes/OUs");
const verifyToken = require("./routes/VerifyToken"); // Imports the middleware
const cors = require('cors');

app.use(cors({
  origin: "https://credential-management-1pl5fp4a7.vercel.app",
  credentials: true
}));

require("dotenv").config();

const app = express();

// Middleware that parses JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connects to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware for debugging
const debugMiddleware = (req, res, next) => {
  console.log(`[DEBUG] ${req.method} request to ${req.originalUrl}`);
  console.log("[DEBUG] Headers:", req.headers);
  console.log("[DEBUG] Body:", req.body);
  next();
};
app.use(debugMiddleware);

// Routes
app.get("/", (req, res) => res.send("Cool-Tech Running"));

// Auth routes (No token verification needed here)
app.use("/api/auth", registerRoutes);
app.use("/api/auth", loginRoutes);

// Applies token verification to all routes after the auth routes
app.use(verifyToken);

// Division-related routes (Protected)
app.use("/api/divisions", divisionRoutes);
app.use("/api/credentials", verifyToken, credentialsRoutes); // Division-specific credentials

// General credentials routes (Protected)
app.use("/api/credentials", credentialsRoutes);

// User info routes (Protected)
app.use("/api/users", userInfoRoutes);

// User assignments routes (Protected)
app.use("/api/users", userAssignmentsRoutes);
app.use("/api/ous", ousRoutes);

// Catch-all for unmatched routes (404)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Starts the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
