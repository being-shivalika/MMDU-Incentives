import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';
import Claim from '../models/Claim.js';
import ApprovalHistory from '../models/ApprovalHistory.js';
import PolicyRule from '../models/PolicyRule.js';
import FinancialYear from '../models/FinancialYear.js';
import WorkflowConfig from '../models/WorkflowConfig.js';
import * as auditService from '../services/auditService.js';
import { createAuditLog } from '../services/auditService.js';
import { AUDIT_ACTIONS } from '../constants/auditActions.js';

// ═══ User Management ═══

export const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 100, role, search, isActive } = req.query;
  const query = {};
  if (role && role !== 'ALL') query.role = role;
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

  const usersWithStats = await Promise.all(users.map(async (u) => {
    const userObj = u.toObject();

    const submissionsCount = await Claim.countDocuments({
      $or: [
        { creator: u._id },
        { creatorEmail: u.email }
      ]
    });

    const approvalsCount = await ApprovalHistory.countDocuments({
      $or: [
        { actionBy: u._id },
        { actionByName: u.name }
      ]
    });

    return {
      ...userObj,
      submissionsCount,
      approvalsCount
    };
  }));
  
  return successResponse(res, 'Users retrieved', { users: usersWithStats, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, institute, employeeId, studentId, phone, designation } = req.body;
  
  if (!name || !email || !password) {
    return errorResponse(res, 'Name, email, and password are required', null, 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return errorResponse(res, `User with email '${normalizedEmail}' already exists in database`, null, 400);
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: role || 'faculty',
    department: department || null,
    institute: institute || 'MMDU',
    employeeId: employeeId || null,
    studentId: studentId || null,
    phone: phone || null,
    designation: designation || null,
    isActive: true,
    isFirstLogin: false
  });
  
  await createAuditLog({
    action: AUDIT_ACTIONS.USER_CREATED,
    entity: 'User',
    entityId: user._id,
    performedBy: req.user?._id,
    details: { name: user.name, email: user.email, role: user.role },
    ipAddress: req.ip
  });
  
  return successResponse(res, 'User created successfully in database', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    isActive: user.isActive,
    isFirstLogin: user.isFirstLogin
  }, 201);
});

export const bulkImportUsers = asyncHandler(async (req, res) => {
  const { users } = req.body;
  if (!Array.isArray(users) || users.length === 0) {
    return errorResponse(res, 'An array of user objects is required for bulk import', null, 400);
  }

  let createdCount = 0;
  let skippedCount = 0;
  const errors = [];
  const createdUsers = [];

  for (let i = 0; i < users.length; i++) {
    const rawUser = users[i];
    const name = rawUser.name ? String(rawUser.name).trim() : '';
    const email = rawUser.email ? String(rawUser.email).toLowerCase().trim() : '';
    const password = rawUser.password ? String(rawUser.password).trim() : 'MMDU@12345';
    let role = rawUser.role ? String(rawUser.role).toLowerCase().trim() : 'faculty';
    const department = rawUser.department ? String(rawUser.department).trim() : null;
    const institute = rawUser.institute ? String(rawUser.institute).trim() : 'MMDU';
    const employeeId = rawUser.employeeId ? String(rawUser.employeeId).trim() : null;
    const studentId = rawUser.studentId ? String(rawUser.studentId).trim() : null;
    const phone = rawUser.phone ? String(rawUser.phone).trim() : null;
    const designation = rawUser.designation ? String(rawUser.designation).trim() : null;

    // Role mapping normalization
    if (role === 'teacher' || role === 'faculty member') role = 'faculty';
    if (role === 'head of department' || role === 'head') role = 'hod';
    if (role === 'finance' || role === 'accountant') role = 'accounts';

    if (!name || !email) {
      skippedCount++;
      errors.push(`Row ${i + 1}: Missing name or email.`);
      continue;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      skippedCount++;
      errors.push(`Row ${i + 1}: Email '${email}' already exists.`);
      continue;
    }

    try {
      const newUser = await User.create({
        name,
        email,
        password,
        role,
        department,
        institute,
        employeeId,
        studentId,
        phone,
        designation,
        isActive: true,
        isFirstLogin: false
      });

      createdCount++;
      createdUsers.push({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      });
    } catch (err) {
      skippedCount++;
      errors.push(`Row ${i + 1} (${email}): ${err.message}`);
    }
  }

  if (createdCount > 0) {
    await createAuditLog({
      action: 'BULK_USERS_IMPORTED',
      entity: 'User',
      performedBy: req.user?._id,
      details: { createdCount, skippedCount, totalProcessed: users.length },
      ipAddress: req.ip
    });
  }

  return successResponse(res, `Bulk user import completed. ${createdCount} imported, ${skippedCount} skipped.`, {
    createdCount,
    skippedCount,
    errors,
    createdUsers
  }, 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return errorResponse(res, 'User not found', null, 404);

  const { name, email, password, role, department, institute, employeeId, studentId, phone, designation, isActive, isFirstLogin } = req.body;

  if (name !== undefined) user.name = name.trim();
  if (email !== undefined) user.email = email.toLowerCase().trim();
  if (role !== undefined) user.role = role;
  if (department !== undefined) user.department = department;
  if (institute !== undefined) user.institute = institute;
  if (employeeId !== undefined) user.employeeId = employeeId;
  if (studentId !== undefined) user.studentId = studentId;
  if (phone !== undefined) user.phone = phone;
  if (designation !== undefined) user.designation = designation;
  if (isActive !== undefined) user.isActive = isActive;
  if (isFirstLogin !== undefined) user.isFirstLogin = isFirstLogin;

  if (password && password.trim().length > 0) {
    user.password = password.trim();
    user.isFirstLogin = false;
  }

  await user.save();

  await createAuditLog({
    action: AUDIT_ACTIONS.USER_UPDATED,
    entity: 'User',
    entityId: user._id,
    performedBy: req.user?._id,
    details: { name: user.name, email: user.email, role: user.role },
    ipAddress: req.ip
  });

  const returnedUser = user.toObject();
  delete returnedUser.password;

  return successResponse(res, 'User updated successfully in database', returnedUser);
});

export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return errorResponse(res, 'User not found', null, 404);
  user.isActive = !user.isActive;
  await user.save();
  return successResponse(res, `User ${user.isActive ? 'activated' : 'deactivated'}`, { id: user._id, isActive: user.isActive });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return errorResponse(res, 'User not found', null, 404);

  await createAuditLog({
    action: AUDIT_ACTIONS.USER_DELETED || 'USER_DELETED',
    entity: 'User',
    entityId: user._id,
    performedBy: req.user?._id,
    details: { name: user.name, email: user.email, role: user.role },
    ipAddress: req.ip
  });

  return successResponse(res, 'User deleted successfully', null);
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

import Circular from '../models/Circular.js';

// ═══ Circulars & Announcements ═══

export const listCirculars = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }
  const circulars = await Circular.find(query).sort({ createdAt: -1 });
  return successResponse(res, 'Circulars retrieved', circulars);
});

export const createCircular = asyncHandler(async (req, res) => {
  const { title, content, category, audience } = req.body;
  if (!title || !title.trim()) {
    return errorResponse(res, 'Circular title is required', null, 400);
  }

  const circular = await Circular.create({
    title: title.trim(),
    content: content || '',
    category: category || 'ANNOUNCEMENT',
    audience: audience || 'All Users',
    createdBy: req.user._id,
    createdByName: req.user.name || 'Admin',
    date: new Date()
  });

  await createAuditLog({
    action: 'CIRCULAR_CREATED',
    entity: 'Circular',
    entityId: circular._id,
    performedBy: req.user._id,
    details: { title: circular.title, audience: circular.audience },
    ipAddress: req.ip
  });

  return successResponse(res, 'Circular published successfully', circular, 201);
});

export const deleteCircular = asyncHandler(async (req, res) => {
  const circular = await Circular.findByIdAndDelete(req.params.id);
  if (!circular) return errorResponse(res, 'Circular not found', null, 404);

  await createAuditLog({
    action: 'CIRCULAR_DELETED',
    entity: 'Circular',
    entityId: circular._id,
    performedBy: req.user._id,
    details: { title: circular.title },
    ipAddress: req.ip
  });

  return successResponse(res, 'Circular deleted successfully', null);
});

export const toggleCircularActive = asyncHandler(async (req, res) => {
  const circular = await Circular.findById(req.params.id);
  if (!circular) return errorResponse(res, 'Circular not found', null, 404);

  circular.isActive = !circular.isActive;
  await circular.save();

  return successResponse(res, `Circular ${circular.isActive ? 'activated' : 'deactivated'}`, circular);
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
