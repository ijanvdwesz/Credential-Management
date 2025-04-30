import React from "react"; // Imports React library
import { Link, useLocation } from "react-router-dom"; // Imports Link component for routing and useLocation hook to get the current location
import "../styles/NavBar.css";//External CSS Styles

const NavBar = () => {
  const location = useLocation(); // useLocation hook that gets the current URL path

  // Array of page objects
  const pages = [
    { name: "Login", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Change User Role", path: "/change-user-role" },
    { name: "User Assignments", path: "/user-assignments" },
    { name: "View Credentials", path: "/view-credentials" },
    { name: "Create Credential", path: "/create-credential" },
    { name: "Update Credentials", path: "/update-credentials" },
  ];

  return (
    <nav className="navbar"> {/* Navbar container */}
      <ul> {/* List that displays the links */}
        {pages
          .filter((page) => page.path !== location.pathname) // Filters out the current page from the navbar
          .map((page) => ( // Iterates through the pages array and renders a list item for each page
            <li key={page.path}>
              <Link to={page.path}>{page.name}</Link> {/* Links component to navigate to the respective page */}
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default NavBar; // Exports the NavBar component
