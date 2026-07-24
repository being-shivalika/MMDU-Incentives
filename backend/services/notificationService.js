import Notification from '../models/Notification.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Create a single notification.
 * @param {Object} params
 * @param {ObjectId} params.recipient - User ID
 * @param {ObjectId} params.sender - User ID (optional)
 * @param {string} params.senderRole
 * @param {string} params.type - Notification type
 * @param {string} params.title
 * @param {string} params.message
 * @param {ObjectId} params.claim - Claim ID (optional)
 * @param {string} params.redirectUrl - Frontend route
 */
export const createNotification = async ({ recipient, sender, senderRole, type, title, message, claim, redirectUrl }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      senderRole,
      type,
      title,
      message,
      claim,
      redirectUrl
    });
    return notification;
  } catch (error) {
    logger.error('Failed to create notification:', error.message);
    return null;
  }
};

/**
 * Create notifications for multiple recipients.
 * @param {Array<ObjectId>} recipientIds
 * @param {Object} notificationData - { sender, senderRole, type, title, message, claim, redirectUrl }
 */
export const createBulkNotifications = async (recipientIds, notificationData) => {
  try {
    const notifications = recipientIds.map(recipientId => ({
      recipient: recipientId,
      ...notificationData
    }));
    await Notification.insertMany(notifications);
  } catch (error) {
    logger.error('Failed to create bulk notifications:', error.message);
  }
};

/**
 * Find users by role (optionally filtered by department).
 * Used to find next reviewers for notifications.
 * @param {string} role
 * @param {string} department - Optional department filter
 * @returns {Array} User objects
 */
export const findUsersByRole = async (role, department = null) => {
  const query = { role, isActive: true };
  if (department) query.department = department;
  return User.find(query).select('_id name email role department');
};

/**
 * Get notifications for a user with pagination.
 */
export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const total = await Notification.countDocuments({ recipient: userId });
  const notifications = await Notification.find({ recipient: userId })
    .populate('sender', 'name role')
    .populate('claim', 'claimNumber title status')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  return {
    notifications,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
};

/**
 * Get unread count for a user.
 */
export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ recipient: userId, isRead: false });
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

/**
 * Mark all notifications as read for a user.
 */
export const markAllAsRead = async (userId) => {
  return Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};
