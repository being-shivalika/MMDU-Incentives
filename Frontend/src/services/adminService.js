import apiClient from "./api";

// List users with search, role, and pagination
export const getUsers = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.role) query.append("role", params.role);
  if (params.isActive !== undefined) query.append("isActive", params.isActive);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit || 50);

  const queryString = query.toString();
  const endpoint = `/admin/users${queryString ? `?${queryString}` : ""}`;

  return await apiClient(endpoint, {
    method: "GET",
  });
};

// Create a new user in database
export const createUser = async (userData) => {
  return await apiClient("/admin/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// Update existing user details
export const updateUser = async (userId, userData) => {
  return await apiClient(`/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

// Delete user from database
export const deleteUser = async (userId) => {
  return await apiClient(`/admin/users/${userId}`, {
    method: "DELETE",
  });
};

// Toggle user active status
export const toggleUserActive = async (userId) => {
  return await apiClient(`/admin/users/${userId}/toggle-active`, {
    method: "PUT",
  });
};

// Get system audit logs
export const getAuditLogs = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.entity) query.append("entity", params.entity);
  if (params.action) query.append("action", params.action);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit || 50);

  const queryString = query.toString();
  const endpoint = `/admin/audit-logs${queryString ? `?${queryString}` : ""}`;

  return await apiClient(endpoint, {
    method: "GET",
  });
};

// Circulars & Bulletins
export const getCirculars = async () => {
  return await apiClient("/admin/circulars", {
    method: "GET",
  });
};

export const createCircular = async (circularData) => {
  return await apiClient("/admin/circulars", {
    method: "POST",
    body: JSON.stringify(circularData),
  });
};

export const deleteCircular = async (circularId) => {
  return await apiClient(`/admin/circulars/${circularId}`, {
    method: "DELETE",
  });
};

export const toggleCircularActive = async (circularId) => {
  return await apiClient(`/admin/circulars/${circularId}/toggle`, {
    method: "PUT",
  });
};

// Financial Years & Policy Rules
export const getFinancialYears = async () => {
  return await apiClient("/admin/financial-years", {
    method: "GET",
  });
};

export const getPolicyRules = async () => {
  return await apiClient("/admin/policy-rules", {
    method: "GET",
  });
};

// Workflow Config
export const getWorkflowConfig = async () => {
  return await apiClient("/admin/workflow-config", {
    method: "GET",
  });
};

export const updateWorkflowConfig = async (configId, configData) => {
  return await apiClient(`/admin/workflow-config/${configId}`, {
    method: "PUT",
    body: JSON.stringify(configData),
  });
};
