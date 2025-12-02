import React from "react";
import { Navigate } from "react-router-dom";

const Authmiddleware = ({ children }) => {
  // Check localStorage first
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");

  if (!authUser || !authUser.token) {
    // Token missing → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Authmiddleware;
