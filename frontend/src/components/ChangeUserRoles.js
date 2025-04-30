import React, { useState } from "react";
import "../styles/App.css"
// Component that changes user roles
const ChangeUserRole = () => {
  const [userId, setUserId] = useState("");  // State that holds the user ID
  const [newRole, setNewRole] = useState("normal_user");  // State that holds the selected role
  const [responseMessage, setResponseMessage] = useState("");  // State for success message
  const [error, setError] = useState("");  // State for error message

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevents default form behavior
    setResponseMessage("");  // Resets the response message
    setError("");  // Resets the error message

    try {
      // Retrieves token from localStorage
      const token = localStorage.getItem("token");

      // Sends PATCH request to change user role
      const response = await fetch(`/api/users/change-role/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",  // Indicates JSON content
          Authorization: `Bearer ${token}`,  // Sends token for authentication
        },
        body: JSON.stringify({ newRole }),  // Sends the new role
      });

      // Handles unsuccessful responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change role");
      }

      const data = await response.json();  // Parses the response
      setResponseMessage(data.message);  // Displays success message
    } catch (err) {
      setError(err.message);  // Displays error message
    }
  };

  return (
    <div className="change-role-container">
      <h2 className="change-role-heading">Change User Role</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId" className="label">
            User ID:
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input-field"
            placeholder="Enter User ID"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newRole" className="label">
            New Role:
          </label>
          <select
            id="newRole"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="input-field"
          >
            <option value="normal_user">Normal User</option>
            <option value="division_manager">Division Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Update Role
        </button>
      </form>

      {responseMessage && (
        <div className="response-message">
          {responseMessage}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ChangeUserRole;
