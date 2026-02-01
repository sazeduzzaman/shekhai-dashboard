// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://shekhai-server.onrender.com/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Session management utilities
export const isSessionValid = () => {
  try {
    const authData = localStorage.getItem("authUser");
    if (!authData) return false;

    const parsed = JSON.parse(authData);
    
    // Check if token exists and is not expired
    if (!parsed.token) return false;
    
    // If expiresAt exists, check it
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      clearSession();
      return false;
    }
    
    return true;
  } catch (error) {
    clearSession();
    return false;
  }
};

export const clearSession = () => {
  localStorage.removeItem("authUser");
  sessionStorage.removeItem('redirectAfterLogin');
};

export const getAuthToken = () => {
  try {
    const authData = localStorage.getItem("authUser");
    if (!authData) return null;

    const parsed = JSON.parse(authData);
    return parsed.token;
  } catch {
    return null;
  }
};

export const getUserData = () => {
  try {
    const authData = localStorage.getItem("authUser");
    if (!authData) return null;

    const parsed = JSON.parse(authData);
    return parsed.user || null;
  } catch {
    return null;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Don't attach token for login/register requests
    if (config.url.includes('/auth/')) {
      return config;
    }

    // Attach token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear invalid session
      clearSession();
      
      // Prevent infinite retry loops
      if (!originalRequest._retry && !originalRequest.url.includes('/auth/')) {
        originalRequest._retry = true;
        
        // Store current path for redirect after login
        if (window.location.pathname !== '/login') {
          sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        }
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?sessionExpired=true';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;