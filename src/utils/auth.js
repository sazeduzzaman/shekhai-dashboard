// src/utils/auth.js
export const logoutUser = (navigate) => {
  localStorage.removeItem("authUser");
  navigate("/login", { replace: true });
};
