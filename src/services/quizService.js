import axios from "axios";

const API_URL = "https://shekhai-server.onrender.com/api/v1/quizzes";

const getAuthHeader = () => {
  const token = localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser")).token
    : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const quizService = {
  // Get quiz by ID
  getQuiz: async (quizId) => {
    const response = await axios.get(`${API_URL}/${quizId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Start a quiz attempt
  startQuizAttempt: async (quizId) => {
    const response = await axios.post(
      `${API_URL}/${quizId}/attempt`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Submit quiz attempt
  submitQuizAttempt: async (quizId, answers) => {
    const response = await axios.post(
      `${API_URL}/${quizId}/submit`,
      { answers },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  // Get user's quiz attempts
  getUserQuizAttempts: async () => {
    const response = await axios.get(`${API_URL}/attempts/my-attempts`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  // Get specific quiz attempt
  getQuizAttempt: async (attemptId) => {
    const response = await axios.get(`${API_URL}/attempts/${attemptId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};