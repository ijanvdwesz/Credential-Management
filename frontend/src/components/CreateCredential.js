import React, { useState, useEffect } from "react"; // Imports necessary React hooks and styles
import "../styles/App.css"; // Imports the styles for the component

const CreateCredential = () => {
  // State that holda the credential form values
  const [newCredential, setNewCredential] = useState({
    username: "",
    password: "",
    description: "",
    place: "",
    division: "",
  });

  // State that holds the list of divisions fetched from the backend
  const [divisions, setDivisions] = useState([]);
  
  // State for loading status, used when fetching divisions
  const [loading, setLoading] = useState(true);
  
  // State for error message if fetching divisions fails
  const [error, setError] = useState(null);
  
  // State for success message when a credential is created successfully
  const [successMessage, setSuccessMessage] = useState("");

  // Retrieves the JWT token from localStorage to use in API requests
  const token = localStorage.getItem("token");

  // useEffect hook that fetches user divisions when the component mounts
  useEffect(() => {
    const fetchUserDivisions = async () => {
      try {
        // Fetches the user's divisions from the backend with the Authorization header
        const response = await fetch("/api/users/user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If response is not ok, throws an error
        if (!response.ok) {
          throw new Error("Failed to fetch user divisions");
        }

        // Parses the response and sets the divisions state
        const userInfo = await response.json();
        setDivisions(userInfo.divisions);
      } catch (err) {
        // Sets error state if an error occurs during fetch
        setError("Error fetching user divisions");
        console.error(err);
      } finally {
        // Sets loading state to false when fetching is complete
        setLoading(false);
      }
    };

    // Calls the function that fetches divisions
    fetchUserDivisions();
  }, [token]); // Dependency array ensures effect runs when the token changes

  // Handles form input change and updates the state with the new value
  const handleChange = ({ target: { name, value } }) => {
    setNewCredential((prev) => ({ ...prev, [name]: value }));
  };

  // Handles form submission that creates a new credential
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior

    // Validates that all required fields are filled in
    if (!newCredential.username || !newCredential.password || !newCredential.division) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      // Sends a POST request to the backend that creates the credential
      const response = await fetch("/api/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCredential), // Sends the form data as JSON
      });

      // If the response is not ok, throws an error
      if (!response.ok) {
        throw new Error("Failed to create credential");
      }

      // Sets success message on successful creation
      setSuccessMessage("Credential created successfully!");

      // Resets the form fields after successful submission
      setNewCredential({ username: "", password: "", description: "", place: "", division: "" });
    } catch (err) {
      // Logs error if the credential creation fails
      console.error("Error creating credential:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Create Credential</h3>
        
        {/* Shows loading message if divisions are being fetched */}
        {loading && <p>Loading divisions...</p>}
        
        {/* Shows error message if there is an error fetching divisions */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {/* Input field for the username */}
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={newCredential.username} onChange={handleChange} required />
        </div>
        
        {/* Input field for the password */}
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={newCredential.password} onChange={handleChange} required />
        </div>
        
        {/* Input field for the description */}
        <div>
          <label>Description:</label>
          <input type="text" name="description" value={newCredential.description} onChange={handleChange} />
        </div>
        
        {/* Input field for the place */}
        <div>
          <label>Place:</label>
          <input type="text" name="place" value={newCredential.place} onChange={handleChange} />
        </div>
        
        {/* Select dropdown for choosing a division */}
        <div>
          <label>Division:</label>
          <select name="division" value={newCredential.division} onChange={handleChange} required>
            <option value="">Select a division</option>
            
            {/* If there are divisions, maps through and creates an option for each */}
            {divisions.length > 0 ? (
              divisions.map((division) => (
                <option key={division._id} value={division._id}>{division.name}</option>
              ))
            ) : (
              // If no divisions, displays a message
              <option value="">No divisions available</option>
            )}
          </select>
        </div>
        
        {/* Submit button */}
        <button type="submit">Create Credential</button>
      </form>

      {/* Shows success message if a credential was successfully created */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default CreateCredential;
