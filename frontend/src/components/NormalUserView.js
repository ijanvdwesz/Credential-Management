import React, { useState, useEffect } from "react";  // Imports React, useState, and useEffect for state management and side effects
import { Link } from "react-router-dom";  // Imports Link for routing to different pages
import "../styles/NormalUserView.css"  // Imports custom styles for the NormalUserView component
const BASE_URL = process.env.REACT_APP_API_URL;

export const NormalUserView = () => {
  const [divisions, setDivisions] = useState([]);  // State that holds divisions related to the user
  const token = localStorage.getItem("token");  // Retrieves the token from localStorage for authentication

  // Fetches user info to get the divisions associated with the user
  useEffect(() => {
    fetch(`${BASE_URL}api/users/user-info`, {
      headers: { Authorization: `Bearer ${token}` },  // Authorization header with the token
    })
      .then((res) => res.json())  // Parses the response data
      .then((data) => {
        setDivisions(data.divisions);  // Sets the divisions retrieved from the response data
      })
      .catch((error) => console.error("Error fetching user info:", error));  // Error handling for the fetch request
  }, [token]);  // Re-running the effect when the token changes

  return (
    <div>
      <h1>Manage Your Credentials</h1>  {/* Heading for the view */}

      <div className="links-container">
        {/* Link to View Credentials page */}
        <Link
          to="/view-credentials"  // Route to the View Credentials page
          state={{ token }}  // Passes the token as state to the destination page
          className="link"  // Applies a CSS class for styling
        >
          View Credentials
        </Link>

        {/* Link to Create Credential page */}
        <Link to="/create-credential" className="link">
          Create Credential
        </Link>
      </div>
    </div>
  );
};
