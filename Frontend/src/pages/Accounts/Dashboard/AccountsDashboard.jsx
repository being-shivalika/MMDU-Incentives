import React, { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import ReviewStats from "../../DepartmentReview/Dashboard/components/ReviewStats";
import ReviewFilters from "../../DepartmentReview/Dashboard/components/ReviewFilters";
import ReviewQueueTable from "../../DepartmentReview/Dashboard/components/ReviewQueueTable";
import AccountsDrawer from "./AccountsDrawer";
import { getSubmissions } from "../../../services/submissionService";
import { processTransition } from "../../../services/workflowService";
import { Calendar, FileSpreadsheet, FileText } from "lucide-react";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

const AccountsDashboard = () => {
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
  const pendingCount = submissions.filter((s) => s.status && s.status.includes("Pending")).length;
  const approvedCount = submissions.filter((s) => s.status === "Approved").length;
  const returnedCount = submissions.filter((s) => s.status === "Revision Requested" || s.status === "Rejected").length;
  const totalCount = submissions.length;

  // Filter data
  const filteredData = submissions.filter((item) => {
    const matchesSearch = 
      (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "All" || item.submissionType === filterType || item.type === filterType;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setIsDrawerOpen(true);
  };

  const handleAction = async (actionType, remarks) => {
    if (!selectedSubmission) return;
    
    let transitionAction;
    if (actionType === "Process Payment") transitionAction = "RELEASE_PAYMENT";
    else return;

    try {
      await processTransition({
        claimId: selectedSubmission.id,
        action: transitionAction,
        remarks: remarks
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
          Welcome Accounts, {user?.name || "Finance Officer"}
        </h1>
        <p className="text-gray-500 mt-1">Process and release approved incentives.</p>
      </div>

      <ReviewStats 
        pendingCount={pendingCount} 
        approvedCount={approvedCount} 
        returnedCount={returnedCount} 
        totalCount={totalCount} 
      />

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">Payment Processing Queue</h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCSV(filteredData, "MMDU_Annual_Incentives_Accounts.csv")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </button>

            <button
              onClick={() => exportToPDF(filteredData, "MMDU_Annual_Incentives_Accounts", { financialYear: "2026-2027" })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
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
          <div className="py-8 text-center text-gray-500">Loading submissions...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No submissions found.</div>
        ) : (
          <ReviewQueueTable 
            data={filteredData} 
            onRowClick={handleRowClick} 
          />
        )}
      </Card>

      <AccountsDrawer 
        isOpen={isDrawerOpen} 
        submission={selectedSubmission} 
        onClose={() => setIsDrawerOpen(false)} 
        onAction={handleAction} 
      />
    </div>
  );
};

export default AccountsDashboard;
