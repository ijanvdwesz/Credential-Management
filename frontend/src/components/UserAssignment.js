import React, { useEffect, useState } from "react";
const BASE_URL = process.env.REACT_APP_API_URL;

// Custom hook that fetches users, divisions, and organizational units (OUs)
const useFetchData = (token) => {
  const [users, setUsers] = useState([]);  // State that stores the list of users
  const [divisions, setDivisions] = useState([]);  // State that stores the list of divisions
  const [ous, setOUs] = useState([]);  // State that stores the list of organizational units (OUs)
  const [loading, setLoading] = useState(true);  // State that manages loading state
  const [error, setError] = useState(null);  // State that handles any errors

  // Function that fetches data from the API for users, divisions, and OUs
  const fetchData = async () => {
    setLoading(true);  // Sets loading state to true when starting the fetch
    try {
      // Fetches data for users, divisions, and OUs concurrently using Promise.all
      const [usersResponse, divisionsResponse, ousResponse] = await Promise.all([
        fetch(`${BASE_URL}/api/users/admin-view`, {
          headers: { Authorization: `Bearer ${token}` },  // Passes the token for authentication
        }),
        fetch(`${BASE_URL}/api/divisions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/api/ous`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Checks if any of the responses were not OK (non-200 status)
      if (!usersResponse.ok || !divisionsResponse.ok || !ousResponse.ok) {
        throw new Error("Error fetching data");
      }

      // Parses the responses as JSON and updates the state with the fetched data
      const [usersData, divisionsData, ousData] = await Promise.all([
        usersResponse.json(),
        divisionsResponse.json(),
        ousResponse.json(),
      ]);

      setUsers(usersData);  // Updates the users state
      setDivisions(divisionsData);  // Updates the divisions state
      setOUs(ousData);  // Updates the OUs state
    } catch (err) {
      setError(err.message);  // Handles error by updating the error state
    } finally {
      setLoading(false);  // Sets loading state to false after data fetch completes (success or failure)
    }
  };

  useEffect(() => {
    fetchData();  // Calls fetchData on component mount or when token changes
  }, [token]);  // Dependency array that runs the effect whenever the token changes

  return { users, divisions, ous, loading, error, fetchData, setUsers };  // Returns the fetched data and state
};

// UserAssignment component for assigning divisions and OUs to users
const UserAssignment = () => {
  const token = localStorage.getItem("token");  // Gets the token from localStorage
  const { users, divisions, ous, loading, error, fetchData, setUsers } = useFetchData(token);  // Calls custom hook

  const [selectedUser, setSelectedUser] = useState(null);  // State that stores the selected user
  const [selectedDivision, setSelectedDivision] = useState("");  // State that stores selected division
  const [selectedOU, setSelectedOU] = useState("");  // State that stores selected OU

  // Function that handles assigning a division to the selected user
  const handleAssignDivision = async () => {
    if (!selectedUser || !selectedDivision) return;  // Ensures a user and division are selected

    try {
      const response = await fetch(`${BASE_URL}/api/users/${selectedUser}/assign-division`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ divisionId: selectedDivision }),  // Sends division ID in the request body
      });

      const data = await response.json();  // Parses response JSON
      alert(data.message);  // Shows alert with the response message

      // Fetches updated data after assignment
      await fetchData();
    } catch (err) {
      alert("Error assigning division");  // Handles error
    }
  };

  // Function that handles removing a division from the user
  const handleRemoveDivision = async (userId, divisionId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${userId}/remove-division`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ divisionId }),  // Sends division ID in the request body
      });

      const data = await response.json();  // Parses response JSON
      alert(data.message);  // Shows alert with the response message

      // Fetches updated data after removal
      await fetchData();
    } catch (err) {
      alert("Error removing division");  // Handles error
    }
  };

  // Function that handles assigning an OU to the selected user
  const handleAssignOU = async () => {
    if (!selectedUser || !selectedOU) return;  // Ensures a user and OU are selected

    try {
      const response = await fetch(`${BASE_URL}/api/users/${selectedUser}/assign-ou`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ouId: selectedOU }),  // Sends OU ID in the request body
      });

      const data = await response.json();  // Parses response JSON
      alert(data.message);  // Shows alert with the response message

      // Fetches updated data after assignment
      await fetchData();
    } catch (err) {
      alert("Error assigning OU");  // Handles error
    }
  };

  // Function that handles removing an OU from the user
  const handleRemoveOU = async (userId, ouId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${userId}/remove-ou`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ouId }),  // Sends OU ID in the request body
      });

      const data = await response.json();  // Parses response JSON
      alert(data.message);  // Shows alert with the response message

      // Fetches updated data after removal
      await fetchData();
    } catch (err) {
      alert("Error removing OU");  // Handles error
    }
  };

  // Shows loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show serror state if there was an issue fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>User Assignments</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Divisions</th>
            <th>OUs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Maps over the users and displays each user's information */}
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>
                {/* Displays the divisions assigned to the user */}
                {user.division.map((div) => (
                  <div key={div._id}>
                    {div.name}{" "}
                    <button onClick={() => handleRemoveDivision(user._id, div._id)}>Remove</button> {/* Remove division button */}
                  </div>
                ))}
              </td>
              <td>
                {/* Displays the OUs assigned to the user */}
                {user.ou.map((ou) => (
                  <div key={ou._id}>
                    {ou.name}{" "}
                    <button onClick={() => handleRemoveOU(user._id, ou._id)}>Remove</button> {/* Remove OU button */}
                  </div>
                ))}
              </td>
              <td>
                {/* Button to select a user for assignment */}
                <button onClick={() => setSelectedUser(user._id)}>Select</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Shows form to assign divisions and OUs if a user is selected */}
      {selectedUser && (
        <div>
          <div>
            <label>Select Division:</label>
            <select onChange={(e) => setSelectedDivision(e.target.value)}>
              <option value="">--Select Division--</option>
              {divisions.map((division) => (
                <option key={division._id} value={division._id}>
                  {division.name}
                </option>
              ))}
            </select>
            <button onClick={handleAssignDivision}>Assign</button>
          </div>

          <div>
            <label>Select OU:</label>
            <select onChange={(e) => setSelectedOU(e.target.value)}>
              <option value="">--Select OU--</option>
              {ous.map((ou) => (
                <option key={ou._id} value={ou._id}>
                  {ou.name}
                </option>
              ))}
            </select>
            <button onClick={handleAssignOU}>Assign</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAssignment;
