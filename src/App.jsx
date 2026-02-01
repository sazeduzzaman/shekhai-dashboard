import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Routes
import { authProtectedRoutes, publicRoutes } from "./routes/index";

// Middleware
import Authmiddleware from "./routes/route";

// Utils
import { isSessionValid } from "./utils/axiosInstance";

import "./assets/scss/theme.scss";

// Session check wrapper
const SessionCheck = ({ children }) => {
  return children; // Authmiddleware will handle protection
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <NonAuthLayout>
              {route.component}
            </NonAuthLayout>
          }
          exact
        />
      ))}

      {/* Protected Routes */}
      {authProtectedRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <SessionCheck>
              <Authmiddleware>
                <VerticalLayout>{route.component}</VerticalLayout>
              </Authmiddleware>
            </SessionCheck>
          }
          exact
        />
      ))}

      {/* Default redirect */}
      <Route path="/" element={
        isSessionValid() 
          ? <Navigate to="/dashboard" replace /> 
          : <Navigate to="/login" replace />
      } />
      
      {/* Redirect unknown routes */}
      <Route path="*" element={
        isSessionValid() 
          ? <Navigate to="/dashboard" replace /> 
          : <Navigate to="/login" replace />
      } />
    </Routes>
  );
};

export default App;