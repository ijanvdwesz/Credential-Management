import React, { useState, useEffect, Component } from "react";
import { useLocation } from "react-router-dom";

const ViewCredentials = () => {
  const location = useLocation();  // Gets location object from react-router-dom
  const token = location.state?.token;  // Gets the token passed via location state

  const [credentials, setCredentials] = useState([]);  // State that stores the fetched credentials
  const [divisions, setDivisions] = useState([]);  // State that stores the user's divisions

  useEffect(() => {
    const fetchCredentialsAndDivisions = async () => {
      try {
        console.log("Token used for fetching: ", token); // Checks if token is available for debugging

        // Fetches the user information
        const userInfoResponse = await fetch("/api/users/user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,  // Sends the token in the Authorization header
          },
        });

        // Handles error if the response is not ok
        if (!userInfoResponse.ok) {
          const errorData = await userInfoResponse.json();
          console.error("Error fetching user info:", errorData.message);  // Log error
          return;
        }

        const userInfo = await userInfoResponse.json();  // Parses the user info response
        setDivisions(userInfo.divisions);  // Sets the divisions for the user

        // Ensures a division is available before fetching credentials
        const selectedDivisionId = userInfo.divisions[0]?._id;  // Selects the first division by default

        if (!selectedDivisionId) {
          console.error("Division ID is missing");  // Handles case where no division is available
          return;
        }

        // Fetches credentials for the selected division
        const credentialsResponse = await fetch(`/api/credentials?divisionId=${selectedDivisionId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,  // Sends the token for authentication
          },
        });

        // Handles error if the credentials response is not ok
        if (!credentialsResponse.ok) {
          const errorData = await credentialsResponse.json();
          console.error("Error fetching credentials:", errorData.message);  // Logs error
          return;
        }

        const credentialsData = await credentialsResponse.json();  // Parses the credentials response
        setCredentials(credentialsData);  // Sets the credentials data
      } catch (error) {
        console.error("Error fetching data:", error);  // Logs any network or other errors
      }
    };

    // Triggers the data fetching only if the token is available
    if (token) fetchCredentialsAndDivisions();
  }, [token]);  // Re-runs the effect whenever the token changes

  return (
    <div>
      <h3>Your Divisions:</h3>
      {/* Renders the list of divisions */}
      <ul>
        {divisions.map((division) => (
          <li key={division._id}>{division.name}</li>  // Displays division name
        ))}
      </ul>

      <h3>Credentials:</h3>
      {/* Renders the list of credentials */}
      <ul>
        {credentials.map((credential) => (
          <li key={credential._id}>
            <strong>Division: {credential.division.name}</strong>  {/* Displays the division name */}
            <div>Username: {credential.username}</div>  {/* Displays the username */}
            <div>Description: {credential.description}</div>  {/* Displays the description */}
            <div>Place: {credential.place}</div>  {/* Displays the place */}
            <div>Password: {credential.password}</div>  {/* Displays the password */}
          </li>
        ))}
      </ul>
    </div>
  );
};
//Exports the ViewCredentials component
export default ViewCredentials;
