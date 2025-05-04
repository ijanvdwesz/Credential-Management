import React, { useState } from "react";  // Imports React and useState for managing form state
import { useNavigate, Link } from "react-router-dom";  // Imports useNavigate for redirection and Link for navigation
const BASE_URL = process.env.REACT_APP_API_URL;

const LoginForm = () => {
  const navigate = useNavigate();  // Hook for navigating to different routes

  // State that manages form input (email, password) and loading/error states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");  // State for error messages
  const [loading, setLoading] = useState(false);  // State for loading state during form submission

  // Handles change in input fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,  // Dynamically updates the input field based on name
    });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevents the default form submission
    setLoading(true);  // Sets loading to true when form is submitted
    setErrorMessage("");  // Clears previous error messages

    try {
      // Sends POST request to the server for login
      const response = await fetch(`${BASE_URL}api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Indicates that we're sending JSON
        },
        body: JSON.stringify(formData),  // Sends email and password as the request body
      });

      const data = await response.json();  // Parses the response data

      if (response.ok) {
        // If login is successful, stores token and role in localStorage
        localStorage.setItem("token", data.token);  // Stores token
        localStorage.setItem("role", data.role);  // Stores role
        navigate("/dashboard");  // Redirects to dashboard after successful login
        console.log("Stored token:", localStorage.getItem("token"));
        console.log("Stored role:", localStorage.getItem("role"));
      } else {
        setErrorMessage(data.message || "Invalid Username or password");  // Sets error message if login fails
      }
    } catch (err) {
      // Handles any errors that occur during the fetch request
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);  // Stops loading once the request is completed
    }
  };

  return (
    <div className="auth-form-container">
      {/* Heading for the login form */}
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Displays error message if there's any */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        
        {/* Email input field */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}  // Controlled input for email
            onChange={handleChange}  // Updates form state on change
            required
          />
        </div>
        
        {/* Password input field */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}  // Controlled input for password
            onChange={handleChange}  // Updates form state on change
            required
          />
        </div>
        
        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {/* Shows loading text while form is being submitted */}
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Link to the registration page for users who don't have an account */}
      <p>
        Don't have an account? 
        <br></br>
        <Link to="/register">Register here</Link>  {/* Redirects user to the register page */}
      </p>

    </div>
  );
};
// Exports the LoginForm
export default LoginForm;
