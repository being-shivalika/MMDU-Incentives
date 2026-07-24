import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';
import PolicyRule from '../models/PolicyRule.js';
import FinancialYear from '../models/FinancialYear.js';
import WorkflowConfig from '../models/WorkflowConfig.js';
import * as auditService from '../services/auditService.js';
import { createAuditLog } from '../services/auditService.js';
import { AUDIT_ACTIONS } from '../constants/auditActions.js';

// ═══ User Management ═══

export const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search, isActive } = req.query;
  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } }
    ];
  }
  
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  return successResponse(res, 'Users retrieved', { users, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, institute, employeeId, studentId, phone, designation } = req.body;
  const user = await User.create({ name, email, password, role, department, institute, employeeId, studentId, phone, designation });
  
  await createAuditLog({
    action: AUDIT_ACTIONS.USER_CREATED,
    entity: 'User',
    entityId: user._id,
    performedBy: req.user._id,
    details: { name, email, role },
    ipAddress: req.ip
  });
  
  return successResponse(res, 'User created successfully', {
    id: user._id, name: user.name, email: user.email, role: user.role,
    department: user.department, isActive: user.isActive
  }, 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) return errorResponse(res, 'User not found', null, 404);
  
  await createAuditLog({
    action: AUDIT_ACTIONS.USER_UPDATED,
    entity: 'User',
    entityId: user._id,
    performedBy: req.user._id,
    details: req.body,
    ipAddress: req.ip
  });
  
  return successResponse(res, 'User updated', user);
});

export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return errorResponse(res, 'User not found', null, 404);
  user.isActive = !user.isActive;
  await user.save();
  return successResponse(res, `User ${user.isActive ? 'activated' : 'deactivated'}`, { id: user._id, isActive: user.isActive });
});

// ═══ Audit Logs ═══

export const getAuditLogs = asyncHandler(async (req, res) => {
  const filters = { entity: req.query.entity, action: req.query.action, performedBy: req.query.performedBy };
  const pagination = { page: req.query.page, limit: req.query.limit };
  const result = await auditService.getAuditLogs(filters, pagination);
  return successResponse(res, 'Audit logs retrieved', result);
});

// ═══ Policy Rules ═══

export const listPolicyRules = asyncHandler(async (req, res) => {
  const { category, isActive } = req.query;
  const query = {};
  if (category) query.category = category;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  const rules = await PolicyRule.find(query).sort({ category: 1, subtype: 1 });
  return successResponse(res, 'Policy rules retrieved', rules);
});

export const createPolicyRule = asyncHandler(async (req, res) => {
  const rule = await PolicyRule.create(req.body);
  return successResponse(res, 'Policy rule created', rule, 201);
});

export const updatePolicyRule = asyncHandler(async (req, res) => {
  const rule = await PolicyRule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!rule) return errorResponse(res, 'Policy rule not found', null, 404);
  return successResponse(res, 'Policy rule updated', rule);
});

// ═══ Financial Years ═══

export const listFinancialYears = asyncHandler(async (req, res) => {
  const years = await FinancialYear.find().sort({ startDate: -1 });
  return successResponse(res, 'Financial years retrieved', years);
});

export const createFinancialYear = asyncHandler(async (req, res) => {
  const fy = await FinancialYear.create(req.body);
  return successResponse(res, 'Financial year created', fy, 201);
});

export const updateFinancialYear = asyncHandler(async (req, res) => {
  const fy = await FinancialYear.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!fy) return errorResponse(res, 'Financial year not found', null, 404);
  return successResponse(res, 'Financial year updated', fy);
});

// ═══ Workflow Config ═══

export const getWorkflowConfig = asyncHandler(async (req, res) => {
  const configs = await WorkflowConfig.find();
  return successResponse(res, 'Workflow configs retrieved', configs);
});

export const updateWorkflowConfig = asyncHandler(async (req, res) => {
  const config = await WorkflowConfig.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!config) return errorResponse(res, 'Config not found', null, 404);
  
  const { invalidateCache } = await import('../services/workflowConfigService.js');
  invalidateCache();
  
  return successResponse(res, 'Workflow config updated', config);
});
