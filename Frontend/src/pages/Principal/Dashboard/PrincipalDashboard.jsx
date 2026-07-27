import React, { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import ReviewStats from "../../DepartmentReview/Dashboard/components/ReviewStats";
import ReviewFilters from "../../DepartmentReview/Dashboard/components/ReviewFilters";
import ReviewQueueTable from "../../DepartmentReview/Dashboard/components/ReviewQueueTable";
import ReviewDrawer from "../../DepartmentReview/Dashboard/components/ReviewDrawer";
import { getSubmissions } from "../../../services/submissionService";
import { processTransition } from "../../../services/workflowService";

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
    const matchesSearch =
      (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.title &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType =
      filterType === "All" ||
      item.submissionType === filterType ||
      item.type === filterType;
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
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome Principal, {user?.department || "Dr. Smith"}
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage institutional research submissions.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100">
          <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
          Authorization Logic Active: Acting as HOD for departments without
          assigned HODs.
        </div>
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
