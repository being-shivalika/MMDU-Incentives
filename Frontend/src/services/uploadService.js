import { getStoredToken } from './api';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const uploadDocument = async (claimId, file) => {
  const token = getStoredToken();
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_URL}/api/uploads/${claimId}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData, // Do not set Content-Type, fetch will set it automatically with boundary for FormData
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload document');
  }
  return data;
};

export const getClaimDocuments = async (claimId) => {
  const token = getStoredToken();
  const response = await fetch(`${API_URL}/api/uploads/${claimId}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch documents');
  }
  return data;
};

export const deleteDocument = async (documentId) => {
  const token = getStoredToken();
  const response = await fetch(`${API_URL}/api/uploads/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete document');
  }
  return data;
};
