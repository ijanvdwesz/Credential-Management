import React from "react";  // Imports React
import LoginForm from "../components/LoginForm";  // Imports the LoginForm component from the components directory

const LoginPage = () => {
  return (
    <div className="auth-page-container">  {/* Container for the authentication page */}
      <LoginForm />  {/* Embeds the LoginForm component where users will input their credentials */}
    </div>
  );
};

export default LoginPage;  {/* Exports the LoginPage component*/}
