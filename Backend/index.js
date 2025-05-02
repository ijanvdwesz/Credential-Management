const express = require("express");
const mongoose = require("mongoose");
const registerRoutes = require("./routes/Register");
const loginRoutes = require("./routes/Login");
const userInfoRoutes = require("./routes/UserInfo");
const divisionRoutes = require("./routes/Division");
const credentialsRoutes = require("./routes/Credentials");
const userAssignmentsRoutes = require("./routes/userAssignments");
const ousRoutes = require("./routes/OUs");
const verifyToken = require("./routes/VerifyToken");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware that parses JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "https://credential-management-1pl5fp4a7.vercel.app",
  "https://credential-management-qtqxvkmy3.vercel.app",
  "https://credential-management-plum.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Connects to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Debugging middleware
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} request to ${req.originalUrl}`);
  console.log("[DEBUG] Headers:", req.headers);
  console.log("[DEBUG] Body:", req.body);
  next();
});

// Public route
app.get("/", (req, res) => res.send("Cool-Tech Running"));

// Public auth routes
app.use("/api/auth", registerRoutes);
app.use("/api/auth", loginRoutes);

// Protected routes (with JWT verification)
app.use("/api/divisions", verifyToken, divisionRoutes);
app.use("/api/credentials", verifyToken, credentialsRoutes);
app.use("/api/users", verifyToken, userInfoRoutes);
app.use("/api/users", verifyToken, userAssignmentsRoutes);
app.use("/api/ous", verifyToken, ousRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
