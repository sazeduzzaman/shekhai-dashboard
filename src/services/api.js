import axios from "axios";

const API_URL = "https://shekhai-server.onrender.com/api/v1";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const authUser = localStorage.getItem("authUser");
  if (authUser) {
    const token = JSON.parse(authUser).token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
