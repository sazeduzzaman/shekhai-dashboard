// services/quizService.js - COMPLETE FIXED VERSION
import axios from "axios";

const API_URL = "https://shekhai-server.onrender.com/api/v1";

// Helper function to get token from localStorage
const getToken = () => {
  try {
    // Get the authUser object from localStorage
    const authUserStr = localStorage.getItem("authUser");

    if (!authUserStr) {
      console.log("⚠️ No authUser found in localStorage");
      return null;
    }

    // Parse the JSON string
    const authUser = JSON.parse(authUserStr);

    // Extract token from the object structure
    if (authUser && authUser.token) {
      const token = authUser.token;

      // Clean the token (remove quotes if any)
      const cleanToken = token.replace(/['"]+/g, "").trim();

      console.log(
        "✅ Token extracted successfully:",
        cleanToken.substring(0, 30) + "..."
      );
      return cleanToken;
    }

    // If authUser is already a token string (fallback for old format)
    if (typeof authUser === "string" && authUser.startsWith("eyJ")) {
      const cleanToken = authUser.replace(/['"]+/g, "").trim();
      console.log(
        "✅ Token (string format):",
        cleanToken.substring(0, 30) + "..."
      );
      return cleanToken;
    }

    console.error("❌ Invalid authUser format:", authUser);
    return null;
  } catch (error) {
    console.error("❌ Error parsing authUser:", error);
    return null;
  }
};

// Helper function to get user info
const getUser = () => {
  try {
    const userStr =
      localStorage.getItem("user") || localStorage.getItem("authUser");
    if (userStr) {
      const userData = JSON.parse(userStr);
      return userData.user || userData;
    }
  } catch (error) {
    console.error("Error getting user:", error);
  }
  return null;
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      console.log(
        `🔐 Adding token to ${config.method?.toUpperCase()} ${config.url}`
      );
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn(
        `⚠️ No token available for ${config.method?.toUpperCase()} ${
          config.url
        }`
      );

      // Check if we're trying to access protected route
      if (config.url.includes("/quizzes") && config.method !== "get") {
        console.error("❌ Attempting protected operation without token!");
      }
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles 401 errors
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${
        response.status
      }`
    );
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `❌ ${error.config.method?.toUpperCase()} ${error.config.url} - ${
          error.response.status
        }`
      );
      console.error("Error data:", error.response.data);

      if (error.response.status === 401) {
        console.error("🛑 401 Unauthorized - Token is invalid or expired");

        // Show user-friendly message
        if (window.location.pathname !== "/login") {
          setTimeout(() => {
            alert("Your session has expired. Please login again.");

            // Clear localStorage
            localStorage.removeItem("authUser");
            localStorage.removeItem("user");

            // Redirect to login
            window.location.href = "/login";
          }, 1000);
        }
      } else if (error.response.status === 403) {
        console.error("⛔ 403 Forbidden - You don't have permission");
      }
    } else if (error.request) {
      console.error("🌐 Network error - No response received");
    } else {
      console.error("🚨 Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Quiz Service Functions
export const quizService = {
  // Get all quizzes
  getQuizzes: async (params = {}) => {
    try {
      console.log("📋 Fetching quizzes...");
      const response = await api.get("/quizzes", { params });
      console.log(`✅ Found ${response.data.data?.length || 0} quizzes`);
      return response.data;
    } catch (error) {
      console.error("❌ Get quizzes error:", error.message);
      throw error;
    }
  },

  // Get single quiz
  getQuiz: async (id) => {
    try {
      console.log(`📋 Fetching quiz ${id}...`);
      const response = await api.get(`/quizzes/${id}`);
      console.log(`✅ Quiz loaded: ${response.data.data?.title}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Get quiz ${id} error:`, error.message);
      throw error;
    }
  },

  // Create quiz - MAIN FIXED FUNCTION
  createQuiz: async (quizData) => {
    try {
      // Get current user to verify permissions
      const user = getUser();
      console.log("👤 Current user:", user);

      if (!user || user.role !== "instructor") {
        throw new Error("Only instructors can create quizzes");
      }

      console.log("📤 Creating quiz...");
      console.log("Quiz data:", JSON.stringify(quizData, null, 2));

      const response = await api.post("/quizzes", quizData);

      console.log("✅ Quiz created successfully!");
      console.log("Quiz ID:", response.data.data?._id);
      console.log("Full response:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Create quiz error details:");
      console.error("Status:", error.response?.status);
      console.error("Error message:", error.response?.data?.message);
      console.error("Error details:", error.response?.data?.error);

      // Provide more specific error messages
      if (error.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("You don't have permission to create quizzes.");
      } else if (error.response?.data?.error) {
        throw new Error(
          `Validation error: ${JSON.stringify(error.response.data.error)}`
        );
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Failed to create quiz. Please try again.");
      }
    }
  },

  // Update quiz
  updateQuiz: async (id, quizData) => {
    try {
      console.log(`📝 Updating quiz ${id}...`);
      const response = await api.put(`/quizzes/${id}`, quizData);
      console.log(`✅ Quiz ${id} updated successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Update quiz ${id} error:`, error.message);
      throw error;
    }
  },

  // Delete quiz
  deleteQuiz: async (id) => {
    try {
      console.log(`🗑️ Deleting quiz ${id}...`);
      const response = await api.delete(`/quizzes/${id}`);
      console.log(`✅ Quiz ${id} deleted successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Delete quiz ${id} error:`, error.message);
      throw error;
    }
  },

  // Publish quiz
  publishQuiz: async (id) => {
    try {
      console.log(`📢 Publishing quiz ${id}...`);
      const response = await api.patch(`/quizzes/${id}/publish`);
      console.log(`✅ Quiz ${id} published successfully`);
      return response.data;
    } catch (error) {
      console.error(`❌ Publish quiz ${id} error:`, error.message);
      throw error;
    }
  },

  // Add question to quiz
  addQuestion: async (id, questionData) => {
    try {
      console.log(`➕ Adding question to quiz ${id}...`);
      const response = await api.post(`/quizzes/${id}/questions`, questionData);
      console.log(`✅ Question added to quiz ${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Add question to quiz ${id} error:`, error.message);
      throw error;
    }
  },

  // Get course quizzes
  getCourseQuizzes: async (courseId, params = {}) => {
    try {
      console.log(`📚 Fetching quizzes for course ${courseId}...`);
      const response = await api.get(`/quizzes/course/${courseId}`, { params });
      console.log(
        `✅ Found ${response.data.data?.length || 0} quizzes for course`
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Get course quizzes ${courseId} error:`, error.message);
      throw error;
    }
  },

  // Get module quizzes
  getModuleQuizzes: async (moduleId, params = {}) => {
    try {
      console.log(`📚 Fetching quizzes for module ${moduleId}...`);
      const response = await api.get(`/quizzes/module/${moduleId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`❌ Get module quizzes ${moduleId} error:`, error.message);
      throw error;
    }
  },

  // Get quiz analytics
  getQuizAnalytics: async (id) => {
    try {
      console.log(`📊 Getting analytics for quiz ${id}...`);
      const response = await api.get(`/quizzes/${id}/analytics`);
      console.log(`✅ Analytics loaded for quiz ${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Get analytics for quiz ${id} error:`, error.message);
      throw error;
    }
  },

  // Get upcoming quizzes
  getUpcomingQuizzes: async (params = {}) => {
    try {
      console.log("📅 Fetching upcoming quizzes...");
      const response = await api.get("/quizzes/upcoming", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Get upcoming quizzes error:", error.message);
      throw error;
    }
  },

  // Get quiz calendar
  getQuizCalendar: async (year, month) => {
    try {
      console.log(`📅 Fetching calendar for ${year}/${month}...`);
      const response = await api.get(`/quizzes/calendar/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Get calendar ${year}/${month} error:`, error.message);
      throw error;
    }
  },
};

// Quiz Attempts Service
export const attemptService = {
  // Start quiz attempt
  startAttempt: async (quizId) => {
    try {
      console.log(`🎯 Starting attempt for quiz ${quizId}...`);
      const response = await api.post(`/quizzes/${quizId}/attempt`);
      console.log(`✅ Attempt started: ${response.data.data?._id}`);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Start attempt for quiz ${quizId} error:`,
        error.message
      );
      throw error;
    }
  },

  // Submit quiz answers
  submitAttempt: async (quizId, answers) => {
    try {
      console.log(`📤 Submitting attempt for quiz ${quizId}...`);
      const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
      console.log(`✅ Attempt submitted. Score: ${response.data.data?.score}`);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Submit attempt for quiz ${quizId} error:`,
        error.message
      );
      throw error;
    }
  },

  // Get user's attempts
  getUserAttempts: async (params = {}) => {
    try {
      console.log("📋 Fetching user attempts...");
      const response = await api.get("/quizzes/my-attempts", { params });
      console.log(`✅ Found ${response.data.data?.length || 0} attempts`);
      return response.data;
    } catch (error) {
      console.error("❌ Get user attempts error:", error.message);
      throw error;
    }
  },

  // Get single attempt
  getAttempt: async (id) => {
    try {
      console.log(`📋 Fetching attempt ${id}...`);
      const response = await api.get(`/quizzes/attempts/${id}`);
      console.log(`✅ Attempt ${id} loaded`);
      return response.data;
    } catch (error) {
      console.error(`❌ Get attempt ${id} error:`, error.message);
      throw error;
    }
  },
};

// Export helper functions for debugging
export const authHelpers = {
  getToken,
  getUser,
  checkAuth: () => {
    const token = getToken();
    const user = getUser();
    return {
      isAuthenticated: !!token,
      token: token ? `${token.substring(0, 20)}...` : null,
      user,
      localStorage: {
        authUser: localStorage.getItem("authUser"),
        user: localStorage.getItem("user"),
      },
    };
  },
};
