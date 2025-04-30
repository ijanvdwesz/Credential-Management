const jwt = require("jsonwebtoken"); // Imports the JWT library for token verification

// Middleware that verifies JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Gets the 'Authorization' header from the request

  // If the authorization header is missing, returns 401 Unauthorized
  if (!authHeader) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  // Extracts the token from the authorization header (Bearer <token>)
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1] // Gets the token after 'Bearer '
    : null;

  // If no token is found, returns 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Verifies the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attaches the decoded user info to the request object
    req.user = decoded;

    // Proceeds to the next middleware or route handler
    next();
  } catch (err) {
    // If token is expired or invalid, returns 403 Forbidden
    const message =
      err.name === "TokenExpiredError"
        ? "Token expired" // If the token has expired
        : "Invalid token"; // If the token is invalid
    return res.status(403).json({ message });
  }
};

module.exports = verifyToken; // Exports the middleware
