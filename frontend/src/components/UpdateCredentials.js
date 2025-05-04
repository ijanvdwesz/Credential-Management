import React, { useState, useEffect } from "react";  // Imports React, useState and useEffect hooks
const BASE_URL = process.env.REACT_APP_API_URL;

// UpdateCredentials component handles the functionality for updating existing credentials
const UpdateCredentials = () => {
  const [credentials, setCredentials] = useState([]);  // State that stores the list of credentials fetched from the API
  const [selectedCredential, setSelectedCredential] = useState(null);  // State that stores the credential selected for update
  const [updatedCredential, setUpdatedCredential] = useState({
    username: "",  // State that manages the input fields for the selected credential
    password: "",
    description: "",
    place: "",
  });

  // Fetches credentials from the API when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");  // Gets the token from localStorage for authentication
    if (token) {
      // Fetches credentials from the API if the token exists
      fetch(`${BASE_URL}api/credentials`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,  // Includes token in the request headers for authentication
        },
      })
        .then((res) => res.json())  // Parses the response as JSON
        .then((data) => setCredentials(data))  // Sets the credentials to state
        .catch((error) => console.error("Error fetching credentials:", error));  // Logs any errors
    } else {
      console.error("No token found in localStorage");  // If no token is found, logs an error
    }
  }, []);  // This effect runs only once when the component mounts

  // When a credential is selected, populates the form with its details for updating
  useEffect(() => {
    if (selectedCredential) {
      setUpdatedCredential({
        username: selectedCredential.username,
        password: selectedCredential.password,
        description: selectedCredential.description,
        place: selectedCredential.place,
      });
    }
  }, [selectedCredential]);  // Runs whenever selectedCredential changes

  // Handles changes to the update form inputs
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCredential((prev) => ({
      ...prev,
      [name]: value,  // Updates the corresponding field in the state
    }));
  };

  // Handles form submission to update the credential
  const handleUpdateSubmit = (e) => {
    e.preventDefault();  // Prevents default form submission

    // Prepares the body for the PATCH request
    const patchData = {};
    if (updatedCredential.username) patchData.username = updatedCredential.username;
    if (updatedCredential.password) patchData.password = updatedCredential.password;
    if (updatedCredential.description) patchData.description = updatedCredential.description;
    if (updatedCredential.place) patchData.place = updatedCredential.place;

    // If no fields are filled out, shows an alert
    if (Object.keys(patchData).length === 0) {
      alert("Please fill out at least one field to update.");
      return;
    }

    const token = localStorage.getItem("token");  // Fetches the token for authorization
    if (!token) {
      alert("No token found, please log in again.");  // Shows alert if no token is found
      return;
    }

    // Updates the selected credential by sending a PATCH request to the backend
    fetch(`${BASE_URL}api/credentials/${selectedCredential._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",  // Sets the content type to JSON
        "Authorization": `Bearer ${token}`,  // Includes the token in the request headers
      },
      body: JSON.stringify(patchData),  // Sends the updated data in the request body
    })
      .then((res) => res.json())  // Parses the response as JSON
      .then((data) => {
        // Update the local credentials state with the updated credential data
        setCredentials((prev) =>
          prev.map((credential) =>
            credential._id === data._id ? data : credential  // Replaces the updated credential
          )
        );
        // Resets form and selected credential after successful update
        setSelectedCredential(null);
        setUpdatedCredential({
          username: "",
          password: "",
          description: "",
          place: "",
        });
      })
      .catch((error) => console.error("Error updating credential:", error));  // Logs any errors
  };

  return (
    <div>
      <h3>Update Credentials</h3>
      <h4>Select a Credential to Update</h4>
      {credentials.length > 0 ? (
        <div>
          {/* List of credentials with onClick event to select a credential */}
          <ul>
            {credentials.map((credential) => (
              <li
                key={credential._id}
                onClick={() => setSelectedCredential(credential)}  // Sets the selected credential
                style={{ cursor: "pointer" }}
              >
                {credential.username} ({credential.place})  {/* Displays credential username and place */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No credentials available.</p>  // Shows message if no credentials are available
      )}

      {/* Shows form to update credential if one is selected */}
      {selectedCredential && (
        <form onSubmit={handleUpdateSubmit}>
          {/* Username input */}
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={updatedCredential.username}
              onChange={handleUpdateChange}
              placeholder={selectedCredential.username}  // Sets placeholder to current username
            />
          </div>

          {/* Password input */}
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={updatedCredential.password}
              onChange={handleUpdateChange}
              placeholder={selectedCredential.password}  // Sets placeholder to current password
            />
          </div>

          {/* Description input */}
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={updatedCredential.description}
              onChange={handleUpdateChange}
              placeholder={selectedCredential.description}  // Sets placeholder to current description
            />
          </div>

          {/* Place input */}
          <div>
            <label>Place:</label>
            <input
              type="text"
              name="place"
              value={updatedCredential.place}
              onChange={handleUpdateChange}
              placeholder={selectedCredential.place}  // Sets placeholder to current place
            />
          </div>

          {/* Submit button that updates the credential */}
          <button type="submit">Update Credential</button>
        </form>
      )}
    </div>
  );
};

export default UpdateCredentials;  // Exports the component
