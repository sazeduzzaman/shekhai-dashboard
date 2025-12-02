import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
  if (!authUser) return <Navigate to="/login" />;

  // Optional: Role-based access
  if (roles && !roles.includes(authUser.user.role)) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
