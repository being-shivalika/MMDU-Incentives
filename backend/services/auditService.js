import AuditLog from '../models/AuditLog.js';
import logger from '../utils/logger.js';

/**
 * Create an audit log entry.
 * @param {Object} params
 * @param {string} params.action - e.g., 'CLAIM_CREATED', 'PAYMENT_RELEASED'
 * @param {string} params.entity - e.g., 'Claim', 'User', 'Transaction'
 * @param {ObjectId} params.entityId - ID of the entity
 * @param {ObjectId} params.performedBy - User who performed the action
 * @param {Object} params.details - Additional details/snapshot
 * @param {string} params.ipAddress - Request IP
 * @returns {Object} Created audit log
 */
export const createAuditLog = async ({ action, entity, entityId, performedBy, details, ipAddress }) => {
  try {
    const log = await AuditLog.create({
      action,
      entity,
      entityId,
      performedBy,
      details,
      ipAddress
    });
    return log;
  } catch (error) {
    // Audit logging should never break the main flow
    logger.error('Failed to create audit log:', error.message);
    return null;
  }
};

/**
 * Get audit logs with filtering and pagination.
 * @param {Object} filters - { entity, entityId, performedBy, action }
 * @param {Object} pagination - { page, limit }
 * @returns {Object} { logs, total, page, pages }
 */
export const getAuditLogs = async (filters = {}, pagination = {}) => {
  const { page = 1, limit = 20 } = pagination;
  const query = {};
  
  if (filters.entity) query.entity = filters.entity;
  if (filters.entityId) query.entityId = filters.entityId;
  if (filters.performedBy) query.performedBy = filters.performedBy;
  if (filters.action) query.action = filters.action;
  
  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .populate('performedBy', 'name email role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  return {
    logs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
};
