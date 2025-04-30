//Imports the nessecary labraries , components and styles
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // 
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/Dashboard";
import UserAssignment from "./components/UserAssignment";
import ChangeUserRole from "./components/ChangeUserRoles";
import { NormalUserView } from "./components/NormalUserView";
import ViewCredentials from "./components/ViewCredentials"; 
import CreateCredential from "./components/CreateCredential";
import UpdateCredentials from "./components/UpdateCredentials";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import './styles/App.css';
import './styles/Dashboard.css';

//Layout component for the app, which handles conditional rendering of NavBar, Footer, and routing logic
const AppLayout = () => {
  const location = useLocation(); // useLocation hook that gets the current URL path

  // Conditional logic that hides NavBar and Footer on login and register pages
  const hideLayout = location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="app-layout"> {/* Main layout container */}
      {/* Conditionally renders header and NavBar based on current location */}
      {!hideLayout && (
        <>
          <header className="dashboard-header"> {/* Header containing title */}
            <h1 className="main-title">COOL_TECH</h1> {/* Main title of the app */}
            <h2 className="sub-title">Credential Management Dashboard</h2> {/* Sub-title */}
          </header>
          <NavBar /> {/* Navigation bar, visible if not on login/register page */}
        </>
      )}

      <main className="content"> {/* Main content area where routes are rendered */}
        <Routes>
          {/* Route definitions for each page */}
          <Route path="/register" element={<RegisterPage />} /> {/* Register page route */}
          <Route path="/login" element={<LoginPage />} /> {/* Login page route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["normal_user", "division_manager", "admin"]}>
                <Dashboard /> {/* Dashboard route with protected access */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-user-role"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ChangeUserRole /> {/* Change user role route, only accessible by admin */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-assignments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserAssignment /> {/* User assignment route, only accessible by admin */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/normal-user"
            element={
              <ProtectedRoute allowedRoles={["normal_user", "admin", "division_manager"]}>
                <NormalUserView /> {/* Normal user view route, protected for various roles */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-credentials"
            element={
              <ProtectedRoute allowedRoles={["normal_user", "admin", "division_manager"]}>
                <ViewCredentials /> {/* View credentials route, protected for various roles */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-credential"
            element={
              <ProtectedRoute allowedRoles={["normal_user", "admin", "division_manager"]}>
                <CreateCredential /> {/* Create credential route, protected for various roles */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-credentials"
            element={
              <ProtectedRoute allowedRoles={["division_manager", "admin"]}>
                <UpdateCredentials /> {/* Update credentials route, protected for division manager and admin */}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage />} /> {/* Catch-all route that redirects to login page */}
        </Routes>
      </main>

      {/* Conditionally renders footer based on the current location */}
      {!hideLayout && <Footer />}
    </div>
  );
};

// Main App component that wraps the app layout in Router context
const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App; // Exports the App component
