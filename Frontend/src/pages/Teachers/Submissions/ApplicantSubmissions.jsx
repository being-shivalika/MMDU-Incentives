import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubmissionCard from "../../../components/Ui/SubmissionCard";

import { getMockSubmissions } from "../../../utils/mockBackend";

const ApplicantSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In the future this will be replaced with an actual API call.
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const mockData = getMockSubmissions();
        // Simulating network delay
        setTimeout(() => {
          setSubmissions(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleCardClick = (submission) => {
    navigate(`/applicant/submissions/${submission.id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
        <button 
          onClick={() => navigate("/applicant/submissions/create/journal")} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Submission
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg animate-pulse">Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">You have not created any submissions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <SubmissionCard 
              key={submission.id} 
              submission={submission} 
              onClick={handleCardClick} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantSubmissions;
