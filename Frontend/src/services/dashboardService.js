import apiClient from './api';

export const getDashboardStats = async () => {
  return await apiClient('/dashboard/stats');
};

export const getRecentSubmissions = async () => {
  return await apiClient('/dashboard/recent');
};

export const getChartData = async () => {
  return await apiClient('/dashboard/chart-data');
};
