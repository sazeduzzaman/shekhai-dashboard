import { clearSession } from "./axiosInstance";

export const logout = (navigate) => {
  clearSession();
  if (navigate) {
    navigate("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
};