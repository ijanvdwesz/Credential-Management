import React, { useState } from "react";  // Imports React and useState hook for state management
import { useNavigate } from "react-router-dom";  // Imports useNavigate for redirecting after successful registration
const BASE_URL = process.env.REACT_APP_API_URL;

// RegisterForm component handles the user registration process
const RegisterForm = () => {
  const navigate = useNavigate();  // Hook for redirecting to a different route after registration

  // State that manages form inputs and UI feedback (error, success, loading)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "normal_user",   // Default role set to 'normal_user'
  });
  const [errorMessage, setErrorMessage] = useState("");  // State that handles error messages
  const [successMessage, setSuccessMessage] = useState("");  // New state for success message after successful registration
  const [loading, setLoading] = useState(false);  // Loading state to handle form submission state

  // handleChange function to update formData state as the user types in the input fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,  // Dynamically update the form data based on the input field name
    });
  };
  
  // handleSubmit function that handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevents default form submission
    setLoading(true);  // Sets loading state to true to show loading indicator
    setErrorMessage("");  // Clears any previous error message
    setSuccessMessage("");  // Resets success message on form submission

    try {
      // Makes API call to register the user with the entered form data
      const response = await fetch(`${BASE_URL}api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Sets the request content type to JSON
        },
        body: JSON.stringify(formData),  // Sends form data in the body of the request
      });

      // Parses response from the backend
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful! You can now log in.");  // Sets success message if registration is successful
        setTimeout(() => navigate("/login"), 3000);  // Redirects to login page after 3 seconds
      } else {
        setErrorMessage(data.message || "Something went wrong");  // Sets error message if registration fails
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");  // Handles any unexpected errors
    } finally {
      setLoading(false);  // Resets loading state after request is completed
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      {/* Displays error and success messages*/}
      {errorMessage && <div className="error-message">{errorMessage}</div>}  {/* Shows error message */}
      {successMessage && <div className="success-message">{successMessage}</div>}  {/* Shows success message */}
      
      <form onSubmit={handleSubmit}>  {/* Handles form submission */}
        {/* Input for Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Input for Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input for Password */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Dropdown for Role selection */}
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="normal_user">Normal</option>  {/* Default role */}
            <option value="division_manager">Management</option>  {/* Division Manager role */}
            <option value="admin">Admin</option>  {/* Admin role */}
          </select>
        </div>

        {/* Submit button */}
        <button type="submit" disabled={loading}> 
          {loading ? "Registering..." : "Register"}  {/* Shows loading state if request is in progress */}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;  // Exports the component
