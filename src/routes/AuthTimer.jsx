import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthTimer = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const authUser = JSON.parse(localStorage.getItem("authUser") || "null");

      // Token missing
      if (!authUser || !authUser.token) {
        navigate("/login", { replace: true });
        return;
      }

      // Token expired
      if (authUser.expiresAt && Date.now() > authUser.expiresAt) {
        localStorage.removeItem("authUser");
        navigate("/login", { replace: true });
      }
    };

    // Check immediately
    checkToken();

    // Then check every second
    const interval = setInterval(checkToken, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate]);

  return children;
};

export default AuthTimer;
