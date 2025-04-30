import React from "react";  // Imports React for component creation
import { Navigate } from "react-router-dom";  // Imports Navigate for redirection

// ProtectedRoute component accepts children (components to be rendered) and allowedRoles (roles permitted to access the route)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");  // Retrieves the token from localStorage (used for authentication)
  const role = localStorage.getItem("role");  // Retrieves the user's role from localStorage

  // Checks if the token exists, if not, redirects the user to the login page
  if (!token) {
    console.log("[DEBUG] No token found. Redirecting to login...");  // Debug message for no token
    return <Navigate to="/" replace />;  // Redirects to login page
  }

  // Checks if the user's role is allowed to access this route, if not, redirect to the login page
  if (!allowedRoles.includes(role)) {
    console.log("[DEBUG] User role is not authorized for this route. Redirecting to login...");  // Debug message for unauthorized role
    return <Navigate to="/" replace />;  // Redirects to login page if role is not authorized
  }

  // If the user has the correct token and their role is authorized, renders the protected content
  return children;  // Grants access to the route's children components
};

export default ProtectedRoute;  // Exports the component
