import apiClient from './api';

export const getSubmissions = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = `/submissions${queryParams ? `?${queryParams}` : ''}`;
  return await apiClient(endpoint);
};

export const getSubmissionById = async (id) => {
  return await apiClient(`/submissions/${id}`);
};

export const createSubmission = async (data) => {
  return await apiClient('/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateSubmission = async (id, data) => {
  return await apiClient(`/submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const saveDraft = async (id, data) => {
  return await apiClient(`/submissions/${id}/draft`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteSubmission = async (id) => {
  return await apiClient(`/submissions/${id}`, {
    method: 'DELETE',
  });
};

export const markClaimAsPaid = async (id, remarks = '') => {
  return await apiClient(`/submissions/${id}/pay`, {
    method: 'PUT',
    body: JSON.stringify({ remarks }),
  });
};

export const markBatchClaimsAsPaid = async (claimIds = [], remarks = '') => {
  return await apiClient('/submissions/pay-batch', {
    method: 'POST',
    body: JSON.stringify({ claimIds, remarks }),
  });
};
