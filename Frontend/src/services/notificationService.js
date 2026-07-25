import apiClient from './api';

export const getNotifications = async () => {
  return await apiClient('/notifications');
};

export const getUnreadCount = async () => {
  return await apiClient('/notifications/unread-count');
};

export const markAllAsRead = async () => {
  return await apiClient('/notifications/read-all', {
    method: 'PUT',
  });
};

export const markAsRead = async (id) => {
  return await apiClient(`/notifications/${id}/read`, {
    method: 'PUT',
  });
};
