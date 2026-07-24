import { useState, useEffect } from "react";
import { submissionsApi } from "../../../services/api/submissions";

export const useSubmissionQueue = (filters = {}) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await submissionsApi.list(filters);
      setSubmissions(data);
    } catch (err) {
      setError(err.message || "Failed to load queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [JSON.stringify(filters)]);

  return {
    submissions,
    loading,
    error,
    refresh: fetchQueue
  };
};
