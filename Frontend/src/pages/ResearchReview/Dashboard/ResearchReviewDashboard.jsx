import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import ReviewStats from "./components/ReviewStats";
import VerificationFilters from "./components/VerificationFilters";
import VerificationQueueTable from "./components/VerificationQueueTable";
import VerificationDrawer from "./components/VerificationDrawer";
import { researchReviewMockData } from "../mock/researchReviewMockData";

const ResearchReviewDashboard = () => {
  const { user } = useAuth();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Compute stats
  const pendingCount = researchReviewMockData.filter((s) => s.status === "pending_verification").length;
  const verifiedCount = researchReviewMockData.filter((s) => s.status === "verified").length;
  const returnedCount = researchReviewMockData.filter((s) => s.status === "returned" || s.status === "rejected").length;
  const forwardedCount = researchReviewMockData.filter((s) => s.status === "forwarded_accounts").length;

  // Filter data
  const filteredData = researchReviewMockData.filter((item) => {
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
    console.log(`Action: ${actionType} on submission ${selectedSubmission?.id}`);
    setIsDrawerOpen(false);
  };

  const getWelcomeTitle = () => {
    if (user?.role === "rd_cell") return "Welcome R&D Cell";
    return "Welcome Research Review Cell";
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {getWelcomeTitle()}
        </h1>
        <p className="text-gray-500 mt-1">Institutional verification after department review.</p>
      </div>

      <ReviewStats 
        pendingCount={pendingCount} 
        verifiedCount={verifiedCount} 
        returnedCount={returnedCount} 
        forwardedCount={forwardedCount} 
      />

      <Card>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Verification Queue</h2>
        </div>
        
        <VerificationFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
        
        <VerificationQueueTable 
          data={filteredData} 
          onRowClick={handleRowClick} 
        />
      </Card>

      <VerificationDrawer 
        isOpen={isDrawerOpen} 
        submission={selectedSubmission} 
        onClose={() => setIsDrawerOpen(false)} 
        onAction={handleAction} 
      />
    </div>
  );
};

export default ResearchReviewDashboard;
