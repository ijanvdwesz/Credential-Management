import React from "react";  // Imports React
import RegisterForm from "../components/RegisterForm";  // Imports the RegisterForm component from the components directory

const RegisterPage = () => {
  return (
    <div className="auth-page-container">  {/* Container for the registration page */}
      <RegisterForm />  {/* Embeds the RegisterForm component where users will input their registration details */}
    </div>
  );
};

export default RegisterPage;  {/* Exports the RegisterPage component */}
