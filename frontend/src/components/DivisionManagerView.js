import React from "react";  // Imports React
import { Link } from "react-router-dom";  // Impors Link component that enables navigation between routes
import { NormalUserView } from "./NormalUserView";  // Imports NormalUserView component

export const DivisionManagerView = () => {
  return (
    <div>
      {/* Renders the NormalUserView component, showing general content for normal users */}
      <NormalUserView />

      {/* Link to navigate to the update credentials page */}
      <Link to="/update-credentials" className="manage-credentials-link">
        Update Credentials
      </Link>
    </div>
  );
};
