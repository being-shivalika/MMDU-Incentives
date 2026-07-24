import { useState, useEffect } from "react";
import { submissionsApi } from "../../../services/api/submissions";
import { workflowApi } from "../../../services/api/workflow";

export const useSubmission = (submissionId) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmission = async () => {
    if (!submissionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await submissionsApi.getById(submissionId);
      setSubmission(data);
    } catch (err) {
      setError(err.message || "Failed to load submission.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const saveDraft = async (formData) => {
    setLoading(true);
    try {
      const updated = await submissionsApi.saveDraft(submissionId, formData);
      setSubmission(updated);
      return updated;
    } catch (err) {
      setError(err.message || "Failed to save draft.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (actionType, comment) => {
    setLoading(true);
    try {
      const updated = await workflowApi.transition(submissionId, actionType, comment);
      setSubmission(updated);
      return updated;
    } catch (err) {
      setError(err.message || "Failed to process transition.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submission,
    loading,
    error,
    reload: fetchSubmission,
    saveDraft,
    handleTransition
  };
};
