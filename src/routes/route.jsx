import React from "react";
import { Navigate } from "react-router-dom";
import { isSessionValid } from "../utils/axiosInstance";

const Authmiddleware = ({ children }) => {
  if (!isSessionValid()) {
    // Clear any invalid session data
    localStorage.removeItem("authUser");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Authmiddleware;