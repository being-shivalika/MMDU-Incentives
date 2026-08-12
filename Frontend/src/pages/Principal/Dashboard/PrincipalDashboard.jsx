import React, { useState, useEffect, useCallback } from "react";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import ReviewStats from "../../DepartmentReview/Dashboard/components/ReviewStats";
import ReviewFilters from "../../DepartmentReview/Dashboard/components/ReviewFilters";
import ReviewQueueTable from "../../DepartmentReview/Dashboard/components/ReviewQueueTable";
import ReviewDrawer from "../../DepartmentReview/Dashboard/components/ReviewDrawer";
import { getSubmissions } from "../../../services/submissionService";
import useSubmissionSync from "../../../hooks/useSubmissionSync";
import { processTransition } from "../../../services/workflowService";

import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

const PrincipalDashboard = () => {
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState([]);

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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

  // Compute stats
  const pendingCount = submissions.filter(
    (s) => s.status && s.status.includes("Pending"),
  ).length;
  const approvedCount = submissions.filter(
    (s) => s.status === "Approved",
  ).length;
  const returnedCount = submissions.filter(
    (s) => s.status === "Revision Requested" || s.status === "Rejected",
  ).length;
  const totalCount = submissions.length;

  // Filter data
  const filteredData = submissions.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || [
      item.id,
      item.claimNumber,
      item.title,
      item.creatorName,
      item.applicantName,
      item.creatorDept,
      item.department,
      item.category,
      item.subtype,
      item.status
    ].some(field => String(field || '').toLowerCase().includes(term));

    const matchesType =
      filterType === "All" ||
      item.submissionType === filterType ||
      item.type === filterType ||
      (item.category && item.category.toLowerCase().includes(filterType.toLowerCase()));

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setIsDrawerOpen(true);
  };

  const handleAction = async (actionType, remarks) => {
    if (!selectedSubmission) return;

    let transitionAction;
    if (actionType === "Approve") transitionAction = "approve";
    else if (actionType === "Reject") transitionAction = "reject";
    else if (actionType === "Request Revision") transitionAction = "return";
    else return;

    try {
      await processTransition({
        claimId: selectedSubmission.id,
        action: transitionAction,
        remarks: remarks,
      });
      await loadSubmissions();
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Error processing transition:", err);
      alert(err.message || "Failed to process review action");
    }
  };

  return (
    <div className="space-y-6 text-left">
     <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome Principal, {user?.department || "Dr. Smith"}
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage institutional research submissions.
        </p>

      </div>

      <ReviewStats
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        returnedCount={returnedCount}
        totalCount={totalCount}
      />

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
            Principal Review Queue
          </h2>
        </div>

        <ReviewFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onExportCSV={() => exportToCSV(filteredData, "Principal_Submissions_Report.csv")}
          onExportPDF={() => exportToPDF(filteredData, "Principal_Submissions_Report.pdf")}
        />

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading submissions...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No submissions found.
          </div>
        ) : (
          <ReviewQueueTable data={filteredData} onRowClick={handleRowClick} />
        )}
      </Card>

      <ReviewDrawer
        isOpen={isDrawerOpen}
        submission={selectedSubmission}
        onClose={() => setIsDrawerOpen(false)}
        onAction={handleAction}
      />
    </div>
  );
};

export default PrincipalDashboard;
