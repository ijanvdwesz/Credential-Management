import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NormalUserView } from "./NormalUserView";
import { DivisionManagerView } from "./DivisionManagerView";
import AdminView from "./AdminView";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetch("/api/users/user-info", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setRole(data.role);
          setLoading(false);
        })
        .catch(() => navigate("/login"));
    }
  }, [navigate]);

  const renderContent = () => {
    switch (role) {
      case "normal_user":
        return <NormalUserView />;
      case "division_manager":
        return <DivisionManagerView />;
      case "admin":
        return <AdminView />;
      default:
        return <p>Invalid role. Please contact the administrator.</p>;
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      {renderContent()}
    </div>
  );
};

export default Dashboard;
