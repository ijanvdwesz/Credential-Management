import React, { useEffect, useState } from "react"; // Imports necessary React hooks
import { DivisionManagerView } from "./DivisionManagerView"; // Imports DivisionManagerView component
import { Link } from "react-router-dom"; // Imports Link component for navigation
import "../styles/AdminView.css" // Imports CSS for styling the Admin View

const AdminView = () => {
  // State that tracks loading status and errors
  const [loading, setLoading] = useState(true); // Initial loading state is true
  const [error, setError] = useState(null); // Initial error state is null

  // useEffect hook that fetches data when the component is mounted
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token"); // Retrieves JWT token from localStorage

      try {
        // Uses Promise.all to fetch divisions and OUs concurrently
        const [divisionsResponse, ousResponse] = await Promise.all([
          fetch("/api/divisions", {
            headers: {
              "Authorization": `Bearer ${token}`, // Attaches token to request headers
            }
          }),
          fetch("/api/ous", {
            headers: {
              "Authorization": `Bearer ${token}`, // Attaches token to request headers
            }
          }),
        ]);

        // Checks if both responses are successful, otherwise throws an error
        if (!divisionsResponse.ok || !ousResponse.ok) {
          throw new Error(`Error: ${divisionsResponse.statusText}`);
        }

        // Waits for both responses to be parsed as JSON
        await Promise.all([divisionsResponse.json(), ousResponse.json()]);
      } catch (err) {
        setError(err.message); // Sets error message if fetching fails
      } finally {
        setLoading(false); // Sets loading to false after data fetching completes
      }
    };

    // Calls the fetchAdminData function when the component mounts
    fetchAdminData();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Shows loading indicator if data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Displays error message if there's an error during data fetching
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Renders DivisionManagerView component */}
      <DivisionManagerView />

      <h3 className="admin-actions-heading">Admin Actions</h3>

      <div className="links-container">
        {/* Link to ChangeUserRole page */}
        <Link
          to="/change-user-role"
          className="link" // Applies CSS class for styling
        >
          Change User Role
        </Link>

        {/* Link to User Assignment page */}
        <Link to="/user-assignments" className="link">
          Manage User Assignments
        </Link>
      </div>
    </div>
  );
};

export default AdminView; // Exports the component
