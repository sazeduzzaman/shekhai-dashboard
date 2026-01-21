// services/dashboardService.js
import api from './api';

// Simple function to get dashboard data (if your backend provides it all in one endpoint)
export const getDashboardOverview = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Simple function for quick stats
export const getQuickStats = async () => {
  try {
    const response = await api.get('/admin/quick-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    throw error;
  }
};

// Add more simple functions as needed...
export const getRecentActivities = async () => {
  try {
    const response = await api.get('/admin/recent-activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

export const getPendingReviews = async () => {
  try {
    const response = await api.get('/admin/pending-reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    throw error;
  }
};