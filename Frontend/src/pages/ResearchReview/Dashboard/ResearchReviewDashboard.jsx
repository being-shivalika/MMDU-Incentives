import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import useAuth from "../../../hooks/useAuth";

import Card from "../../../components/Ui/Card";
import ReviewStats from "./components/ReviewStats";
import VerificationFilters from "./components/VerificationFilters";
import VerificationQueueTable from "./components/VerificationQueueTable";

import { getSubmissions } from "../../../services/submissionService";
import useSubmissionSync from "../../../hooks/useSubmissionSync";
import { ROUTES } from "../../../constants/routes";

import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

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

  const loadSubmissions = useCallback(async () => {
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
  }, []);

  useSubmissionSync(loadSubmissions, 3000);
  // Dashboard Statistics
  const stats = {
    pendingAnalysis: submissions.filter((s) => {
      const ost = String(s.originalStatus || "").toUpperCase();
      const st = String(s.status || "").toUpperCase();
      return ost === "RPC_VERIFICATION" || ost === "PRINCIPAL_REVIEW" || st.includes("PENDING R & D") || st.includes("PENDING RPC");
    }).length,

    underReview: submissions.filter((s) => {
      const ost = String(s.originalStatus || "").toUpperCase();
      return ost === "RPC_VERIFICATION" || ost === "PRINCIPAL_REVIEW";
    }).length,

    readyForAccounts: submissions.filter((s) => {
      const ost = String(s.originalStatus || "").toUpperCase();
      const st = String(s.status || "").toUpperCase();
      return ost === "ACCOUNTS_PROCESSING" || s.isAccountsApproved || st.includes("ACCOUNTS");
    }).length,

    returnedForClarification: submissions.filter((s) => {
      const ost = String(s.originalStatus || "").toUpperCase();
      const st = String(s.status || "").toUpperCase();
      return ost === "RETURNED" || st.includes("RETURN") || st.includes("REVISION");
    }).length,

    rejected: submissions.filter((s) => {
      const ost = String(s.originalStatus || "").toUpperCase();
      const st = String(s.status || "").toUpperCase();
      return ost === "REJECTED" || st.includes("REJECT");
    }).length,

    completedToday: submissions.filter((s) => {
      const ost = String(s.originalStatus || "").toUpperCase();
      const st = String(s.status || "").toUpperCase();
      if (!(ost === "COMPLETED" || ost === "ACCOUNTS_PROCESSING" || s.isAccountsApproved || st.includes("APPROVED") || st.includes("ACCOUNTS"))) return false;

      const date = s.updatedAt || s.submittedAt;
      return date && dayjs(date).isSame(dayjs(), "day");
    }).length,

    totalIncentiveValue: submissions
      .filter((s) => s.originalStatus === "COMPLETED" || s.isPaid || s.isAccountsApproved)
      .reduce((total, s) => total + Number(s.userShare || s.approvedAmount || s.incentiveAmount || 0), 0),
  };

  // Search & Filters
  const filteredData = submissions.filter((item) => {
    const ost = String(item.originalStatus || "").toUpperCase();
    const st = String(item.status || "").toUpperCase();
    const itemDept = String(item.department || item.creatorDept || "").toLowerCase();
    const itemCategory = String(item.category || item.submissionType || item.type || "").toLowerCase();
    const itemQuartile = String(item.metadata?.quartile || item.fields?.quartile || item.quartile || "").toUpperCase();
    const itemDate = item.submittedAt || item.dateSubmitted || item.createdAt;
    const itemYear = itemDate ? dayjs(itemDate).format("YYYY") : "";

    // 1. Status Filter
    if (filters.status !== "All") {
      if (filters.status === "Pending" || filters.status === "Under Review") {
        const isPending = ost === "RPC_VERIFICATION" || ost === "PRINCIPAL_REVIEW" || st.includes("PENDING R & D") || st.includes("PENDING RPC") || st.includes("UNDER REVIEW");
        if (!isPending) return false;
      } else if (filters.status === "Approved") {
        const isApproved = ost === "ACCOUNTS_PROCESSING" || ost === "COMPLETED" || item.isAccountsApproved || st.includes("ACCOUNTS") || st.includes("APPROVED") || st.includes("DISBURSED");
        if (!isApproved) return false;
      } else if (filters.status === "Revision Requested") {
        const isReturned = ost === "RETURNED" || st.includes("RETURN") || st.includes("REVISION");
        if (!isReturned) return false;
      } else if (filters.status === "Rejected") {
        const isRejected = ost === "REJECTED" || st.includes("REJECT");
        if (!isRejected) return false;
      }
    }

    // 2. Search Term Filter
    const term = filters.searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      [
        item.id,
        item.claimNumber,
        item.title,
        item.submittedBy,
        item.creatorName,
        item.applicantName,
        item.creatorDept,
        item.department,
        item.category,
        item.subtype,
        item.status
      ].some(field => String(field || '').toLowerCase().includes(term));

    if (!matchesSearch) return false;

    // 3. Department Filter
    if (filters.department !== "All") {
      const targetDept = filters.department.toLowerCase();
      if (!itemDept.includes(targetDept)) return false;
    }

    // 4. Research Type Filter
    if (filters.researchType !== "All") {
      const targetType = filters.researchType.toLowerCase();
      if (!itemCategory.includes(targetType)) return false;
    }

    // 5. Quartile Filter
    if (filters.quartile !== "All") {
      if (filters.quartile === "Unranked") {
        if (itemQuartile && itemQuartile !== "-") return false;
      } else if (itemQuartile !== filters.quartile) {
        return false;
      }
    }

    // 6. Year Filter
    if (filters.year !== "All") {
      if (itemYear !== filters.year) return false;
    }

    return true;
  });

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

        <VerificationFilters
          filters={filters}
          setFilters={setFilters}
          onExportCSV={() => exportToCSV(filteredData, "Research_Review_Submissions_Report.csv")}
          onExportPDF={() => exportToPDF(filteredData, "Research_Review_Submissions_Report.pdf")}
        />

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
