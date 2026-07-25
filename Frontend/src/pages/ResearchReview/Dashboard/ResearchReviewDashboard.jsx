import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import ReviewStats from "./components/ReviewStats";
import VerificationFilters from "./components/VerificationFilters";
import VerificationQueueTable from "./components/VerificationQueueTable";
import { getSubmissions } from "../../../services/submissionService";
import { ROUTES } from "../../../constants/routes";

const ResearchReviewDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [submissions, setSubmissions] = useState([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    searchTerm: "",
    department: "All",
    researchType: "All",
    publicationType: "All",
    quartile: "All",
    year: "All",
    status: "All"
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSubmissions();
      const data = response.data || [];
      setSubmissions(data);
    } catch (err) {
      console.error("Error loading submissions:", err);
      setError(err.message || "Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [user]);

  // Compute stats
  const stats = {
    pendingAnalysis: submissions.filter((s) => s.status && s.status.includes("Pending")).length,
    underReview: submissions.filter((s) => s.status === "Under Review" || s.status === "RPC Review").length,
    readyForAccounts: submissions.filter((s) => s.status === "Approved").length,
    returnedForClarification: submissions.filter((s) => s.status === "Revision Requested" || s.status === "Returned").length,
    rejected: submissions.filter((s) => s.status === "Rejected").length,
    completedToday: submissions.filter((s) => {
      const isCompleted = s.status === "Approved" || s.status === "Rejected";
      // Fallback if updatedAt isn't available
      const dateToCheck = s.updatedAt || s.submittedAt;
      return isCompleted && dayjs(dateToCheck).isSame(dayjs(), 'day');
    }).length,
    totalIncentiveValue: submissions
      .filter((s) => s.status === "Approved")
      .reduce((sum, s) => sum + (s.incentiveAmount || 15000), 0) // Placeholder 15000 if not available
  };

  // Filter data
  const filteredData = submissions.filter((item) => {
    const term = filters.searchTerm.toLowerCase();
    const matchesSearch = 
      (item.id && item.id.toLowerCase().includes(term)) || 
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.submittedBy && item.submittedBy.toLowerCase().includes(term));
      
    const matchesDept = filters.department === "All" || item.department === filters.department;
    const matchesType = filters.researchType === "All" || item.submissionType === filters.researchType || item.type === filters.researchType;
    const matchesStatus = filters.status === "All" || item.status === filters.status;
    const matchesQuartile = filters.quartile === "All" || item.metadata?.quartile === filters.quartile || item.fields?.quartile === filters.quartile;
    
    // Add more filter logic here based on publicationType and year if available in data
    return matchesSearch && matchesDept && matchesType && matchesStatus && matchesQuartile;
  });

  const handleRowClick = (submission) => {
    // Navigate to the new full details page
    navigate(ROUTES.RESEARCH_REVIEW_DETAILS.replace(":id", submission.id));
  };

  const getWelcomeTitle = () => {
    if (user?.role === "rd_cell") return "Welcome R&D Cell";
    return "Welcome Research Review Cell";
  };

  return (
    <div className="space-y-6 text-left pb-10 w-full max-w-full overflow-x-hidden">
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {getWelcomeTitle()}
        </h1>
        <p className="text-gray-500 mt-1">Final academic evaluation and verification before accounts processing.</p>
      </div>

      <ReviewStats stats={stats} />

      <Card className="min-w-0 overflow-hidden">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
          <h2 className="text-xl font-bold text-gray-900">RPC Analysis & Verification Queue</h2>
        </div>
        
        <VerificationFilters 
          filters={filters}
          setFilters={setFilters}
        />
        
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-gray-500 font-medium">Loading submissions...</div>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 font-medium">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 mt-4">
            <div className="text-gray-400 mb-2">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="text-gray-500 font-medium text-lg">No submissions found matching criteria.</div>
            <button 
              onClick={() => setFilters({ searchTerm: "", department: "All", researchType: "All", publicationType: "All", quartile: "All", year: "All", status: "All" })}
              className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <VerificationQueueTable 
            data={filteredData} 
            onRowClick={handleRowClick} 
          />
        )}
      </Card>
    </div>
  );
};

export default ResearchReviewDashboard;
