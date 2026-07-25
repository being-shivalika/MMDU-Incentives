import apiClient from './api';

export const listTransactions = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = `/transactions${queryParams ? `?${queryParams}` : ''}`;
  return await apiClient(endpoint);
};

export const getTransactionByClaim = async (claimId) => {
  return await apiClient(`/transactions/claim/${claimId}`);
};
