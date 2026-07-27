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

  const [filters, setFilters] = useState({
    searchTerm: "",
    department: "All",
    researchType: "All",
    publicationType: "All",
    quartile: "All",
    year: "All",
    status: "All",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadSubmissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSubmissions();
      const data = response.data || [];

      const statusMap = {
        hod: "Pending HOD Review",
        principal: "Pending Principal Review",
        director: "Pending Director Review",
        rd_cell: "Pending R&D Review",
        rpc_cell: "Pending RPC Review",
        accounts: "Pending Accounts Review",
      };

      const expectedStatus = statusMap[user?.role];

      // If this role isn't in the map, don't filter anything
      const queue = expectedStatus
        ? data.filter((submission) => submission.status === expectedStatus)
        : [];

      setSubmissions(queue);
    } catch (err) {
      console.error("Error loading submissions:", err);
      setError(err.message || "Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      loadSubmissions();
    }
  }, [user]);
  // Dashboard Statistics
  const stats = {
    pendingAnalysis: submissions.filter((s) => s.status?.includes("Pending"))
      .length,

    underReview: submissions.filter((s) =>
      ["Under Review", "RPC Review"].includes(s.status),
    ).length,

    readyForAccounts: submissions.filter(
      (s) => s.status === "Pending Accounts Review",
    ).length,

    returnedForClarification: submissions.filter((s) =>
      ["Revision Requested", "Returned"].includes(s.status),
    ).length,

    rejected: submissions.filter((s) => s.status === "Rejected").length,

    completedToday: submissions.filter((s) => {
      if (!["Approved", "Rejected"].includes(s.status)) return false;

      const date = s.updatedAt || s.submittedAt;
      return date && dayjs(date).isSame(dayjs(), "day");
    }).length,

    totalIncentiveValue: submissions
      .filter((s) => s.status === "Approved")
      .reduce((total, s) => total + Number(s.incentiveAmount || 0), 0),
  };

  // Search & Filters
  const filteredData = submissions.filter((item) => {
    const term = filters.searchTerm.toLowerCase();

    const matchesSearch =
      !term ||
      item.id?.toLowerCase().includes(term) ||
      item.title?.toLowerCase().includes(term) ||
      item.submittedBy?.toLowerCase().includes(term);

    const matchesDepartment =
      filters.department === "All" || item.department === filters.department;

    const matchesResearchType =
      filters.researchType === "All" ||
      item.submissionType === filters.researchType ||
      item.type === filters.researchType;

    const matchesStatus =
      filters.status === "All" || item.status === filters.status;

    const matchesQuartile =
      filters.quartile === "All" ||
      item.metadata?.quartile === filters.quartile ||
      item.fields?.quartile === filters.quartile;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesResearchType &&
      matchesStatus &&
      matchesQuartile
    );
  }); // Open Submission Details
  const handleRowClick = (submission) => {
    navigate(ROUTES.RESEARCH_REVIEW_DETAILS.replace(":id", submission.id));
  };

  // Dashboard Heading
  const getWelcomeTitle = () => {
    switch (user?.role) {
      case "rd_cell":
        return "Welcome R&D Cell";

      case "rpc_cell":
        return "Welcome RPC Cell";

      default:
        return "Welcome Research Review";
    }
  };

  // Queue Heading
  const getQueueTitle = () => {
    switch (user?.role) {
      case "rd_cell":
        return "R&D Review Queue";

      case "rpc_cell":
        return "RPC Analysis & Verification Queue";

      default:
        return "Research Review Queue";
    }
  };

  // Empty State Message
  const getEmptyMessage = () => {
    switch (user?.role) {
      case "rd_cell":
        return "No submissions are awaiting R&D review.";

      case "rpc_cell":
        return "No submissions are awaiting RPC verification.";

      default:
        return "No submissions found.";
    }
  };
  return (
    <div className="space-y-6 text-left pb-10 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {getWelcomeTitle()}
        </h1>

        <p className="text-gray-500 mt-1">
          Review, verify and process research submissions assigned to your
          review queue.
        </p>
      </div>

      {/* Statistics */}
      <ReviewStats stats={stats} />

      {/* Queue */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b pb-4 mb-5">
          <h2 className="text-xl font-bold text-gray-900">{getQueueTitle()}</h2>
        </div>

        <VerificationFilters filters={filters} setFilters={setFilters} />

        {isLoading ? (
          <div className="py-16 flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>

            <p className="mt-4 text-gray-500">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 flex flex-col items-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <svg
              className="h-12 w-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>

            <p className="text-lg font-medium text-gray-600">
              {getEmptyMessage()}
            </p>

            <button
              onClick={() =>
                setFilters({
                  searchTerm: "",
                  department: "All",
                  researchType: "All",
                  publicationType: "All",
                  quartile: "All",
                  year: "All",
                  status: "All",
                })
              }
              className="mt-5 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
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
