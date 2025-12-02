import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Layouts
import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Routes
import { authProtectedRoutes, publicRoutes } from "./routes/index";

// Middleware
import Authmiddleware from "./routes/route";

import "./assets/scss/theme.scss";

// Token auto-expiration wrapper
const AuthTimer = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkToken = () => {
      const authUser = JSON.parse(localStorage.getItem("authUser") || "null");

      if (
        !authUser ||
        !authUser.token ||
        (authUser.expiresAt && Date.now() > authUser.expiresAt)
      ) {
        localStorage.removeItem("authUser");
        navigate("/login", { replace: true });
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          exact
        />
      ))}

      {/* Protected Routes */}
      {authProtectedRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <AuthTimer>
              <Authmiddleware>
                <VerticalLayout>{route.component}</VerticalLayout>
              </Authmiddleware>
            </AuthTimer>
          }
          exact
        />
      ))}

      {/* Redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
