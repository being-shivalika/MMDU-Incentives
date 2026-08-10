import apiClient from './api';
import { notifyClaimsUpdated } from '../hooks/useSubmissionSync';

export const getSubmissions = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = `/submissions${queryParams ? `?${queryParams}` : ''}`;
  return await apiClient(endpoint);
};

export const getSubmissionById = async (id) => {
  return await apiClient(`/submissions/${id}`);
};

export const createSubmission = async (data) => {
  const res = await apiClient('/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  notifyClaimsUpdated();
  return res;
};

export const updateSubmission = async (id, data) => {
  const res = await apiClient(`/submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  notifyClaimsUpdated();
  return res;
};

export const saveDraft = async (id, data) => {
  const res = await apiClient(`/submissions/${id}/draft`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  notifyClaimsUpdated();
  return res;
};

export const deleteSubmission = async (id) => {
  const res = await apiClient(`/submissions/${id}`, {
    method: 'DELETE',
  });
  notifyClaimsUpdated();
  return res;
};

export const approveClaimPayment = async (id, remarks = '') => {
  const res = await apiClient(`/submissions/${id}/approve-payment`, {
    method: 'PUT',
    body: JSON.stringify({ remarks }),
  });
  notifyClaimsUpdated();
  return res;
};

export const markClaimAsPaid = async (id, remarks = '') => {
  const res = await apiClient(`/submissions/${id}/pay`, {
    method: 'PUT',
    body: JSON.stringify({ remarks }),
  });
  notifyClaimsUpdated();
  return res;
};

export const markBatchClaimsAsPaid = async (claimIds = [], remarks = '') => {
  const res = await apiClient('/submissions/pay-batch', {
    method: 'POST',
    body: JSON.stringify({ claimIds, remarks }),
  });
  notifyClaimsUpdated();
  return res;
};
