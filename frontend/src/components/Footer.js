import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT from storage
    navigate("/"); // Redirect to login page
  };

  return (
    <footer className="footer">
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </footer>
  );
};

export default Footer;
