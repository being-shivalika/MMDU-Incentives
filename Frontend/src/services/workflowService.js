import apiClient from './api';

export const processTransition = async (data) => {
  // Map frontend generic fields to backend expected fields
  const payload = {
    submissionId: data.submissionId || data.claimId,
    actionType: data.actionType || data.action,
    comment: data.comment || data.remarks,
    incentiveAmount: data.incentiveAmount
  };

  // Frontend validation to prevent API call if required data is missing
  if (!payload.submissionId) {
    throw new Error("submissionId is required");
  }
  if (!payload.actionType) {
    throw new Error("actionType is required");
  }
  if (["reject", "return"].includes(payload.actionType) && (!payload.comment || payload.comment.trim() === "")) {
    throw new Error("Remarks are required for this action");
  }

  // Log request payload during development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log("processTransition payload:", payload);
  }

  return await apiClient('/workflow/transition', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getWorkflowConfig = async () => {
  return await apiClient('/workflow/config');
};

export const updateWorkflowConfig = async (id, data) => {
  return await apiClient(`/workflow/config/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
