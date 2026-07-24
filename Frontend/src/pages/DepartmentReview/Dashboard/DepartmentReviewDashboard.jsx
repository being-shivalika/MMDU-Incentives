import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import ReviewStats from "./components/ReviewStats";
import ReviewFilters from "./components/ReviewFilters";
import ReviewQueueTable from "./components/ReviewQueueTable";
import ReviewDrawer from "./components/ReviewDrawer";
import { departmentReviewMockData } from "../departmentReviewMockData";

const DepartmentReviewDashboard = () => {
  const { user } = useAuth();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Compute stats
  const pendingCount = departmentReviewMockData.filter((s) => s.status === "pending_review").length;
  const approvedCount = departmentReviewMockData.filter((s) => s.status === "approved").length;
  const returnedCount = departmentReviewMockData.filter((s) => s.status === "returned" || s.status === "rejected").length;
  const totalCount = departmentReviewMockData.length;

  // Filter data
  const filteredData = departmentReviewMockData.filter((item) => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.applicant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || item.type === filterType;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setIsDrawerOpen(true);
  };

  const handleAction = (actionType) => {
    // In a real app, this would call an API
    console.log(`Action: ${actionType} on submission ${selectedSubmission?.id}`);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome HOD, {user?.department || "Computer Science & Engineering"}
        </h1>
        <p className="text-gray-500 mt-1">Review and manage department research submissions.</p>
      </div>

      <ReviewStats 
        pendingCount={pendingCount} 
        approvedCount={approvedCount} 
        returnedCount={returnedCount} 
        totalCount={totalCount} 
      />

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Department Review Queue</h2>
        </div>
        
        <ReviewFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        
        <ReviewQueueTable 
          data={filteredData} 
          onRowClick={handleRowClick} 
        />
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

export default DepartmentReviewDashboard;
