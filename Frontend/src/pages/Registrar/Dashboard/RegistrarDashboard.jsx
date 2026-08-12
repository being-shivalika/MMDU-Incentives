// import React, { useState, useEffect, useCallback } from "react";
// import useAuth from "../../../hooks/useAuth";
// import Card from "../../../components/Ui/Card";
// import ReviewFilters from "../../DepartmentReview/Dashboard/components/ReviewFilters";
// import ReviewQueueTable from "../../DepartmentReview/Dashboard/components/ReviewQueueTable";
// import ReviewDrawer from "../../DepartmentReview/Dashboard/components/ReviewDrawer";
// import { getSubmissions } from "../../../services/submissionService";
// import useSubmissionSync from "../../../hooks/useSubmissionSync";
// import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

// const RegistrarDashboard = () => {
//   const { user } = useAuth();
  
//   const [submissions, setSubmissions] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("All");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedSubmission, setSelectedSubmission] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const loadSubmissions = useCallback(async () => {
//     try {
//       const response = await getSubmissions();
//       const data = response.data || [];
//       setSubmissions(data);
//     } catch (err) {
//       console.error("Error loading registrar submissions:", err);
//       setError(err.message || "Failed to load submissions");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useSubmissionSync(loadSubmissions, 3000);

//   const filteredData = submissions.filter((item) => {
//     const term = searchTerm.toLowerCase().trim();
//     const matchesSearch = !term || [
//       item.id,
//       item.claimNumber,
//       item.title,
//       item.creatorName,
//       item.applicantName,
//       item.creatorDept,
//       item.department,
//       item.category,
//       item.subtype,
//       item.status
//     ].some(field => String(field || '').toLowerCase().includes(term));

//     const matchesType =
//       filterType === "All" ||
//       item.submissionType === filterType ||
//       item.type === filterType ||
//       (item.category && item.category.toLowerCase().includes(filterType.toLowerCase()));

//     const matchesStatus =
//       filterStatus === "All" || item.status === filterStatus;

//     return matchesSearch && matchesType && matchesStatus;
//   });

//   const handleRowClick = (submission) => {
//     setSelectedSubmission(submission);
//     setIsDrawerOpen(true);
//   };

//   return (
//     <div className="space-y-6 text-left">
//       <div className="bg-white rounded-xl p-6 border shadow-sm">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Welcome Registrar, {user?.name || "Dr. Sumit Mittal"}
//         </h1>
//         <p className="text-gray-500 mt-1">Institutional Portal Submissions Overview (All Departments & Institutes).</p>
//       </div>

//       <Card>
//         <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
//             Institutional Submissions Register
//           </h2>
//         </div>

//         <ReviewFilters
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           filterType={filterType}
//           setFilterType={setFilterType}
//           filterStatus={filterStatus}
//           setFilterStatus={setFilterStatus}
//           onExportCSV={() => exportToCSV(filteredData, "Registrar_All_Portal_Submissions_Report.csv")}
//           onExportPDF={() => exportToPDF(filteredData, "Registrar_All_Portal_Submissions_Report.pdf")}
//         />

//         {isLoading ? (
//           <div className="py-8 text-center text-gray-500">Loading portal submissions...</div>
//         ) : error ? (
//           <div className="py-8 text-center text-red-500">{error}</div>
//         ) : filteredData.length === 0 ? (
//           <div className="py-8 text-center text-gray-500">No submissions found.</div>
//         ) : (
//           <ReviewQueueTable data={filteredData} onRowClick={handleRowClick} />
//         )}
//       </Card>

//       <ReviewDrawer
//         isOpen={isDrawerOpen}
//         submission={selectedSubmission}
//         onClose={() => setIsDrawerOpen(false)}
//         onAction={() => {}}
//       />
//     </div>
//   );
// };

// export default RegistrarDashboard;
import React, { useState, useCallback, useMemo } from "react";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import ReviewFilters from "../../DepartmentReview/Dashboard/components/ReviewFilters";
import ReviewQueueTable from "../../DepartmentReview/Dashboard/components/ReviewQueueTable";
import ReviewDrawer from "../../DepartmentReview/Dashboard/components/ReviewDrawer";
import { getSubmissions } from "../../../services/submissionService";
import useSubmissionSync from "../../../hooks/useSubmissionSync";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

const RegistrarDashboard = () => {
  const { user } = useAuth();
  
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
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
      console.error("Error loading registrar submissions:", err);
      setError(err.message || "Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useSubmissionSync(loadSubmissions, 3000);

  const filteredData = useMemo(() => {
    return submissions.filter((item) => {
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
  }, [submissions, searchTerm, filterType, filterStatus]);

  const handleRowClick = (submission) => {
    setSelectedSubmission(submission);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 text-left w-full max-w-full">
      {/* Clean Minimalist Header */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Welcome Registrar, {user?.name || "Dr. Sumit Mittal"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Institutional Portal Submissions Overview (All Departments & Institutes)
        </p>
      </div>

      {/* Main Data Card */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        {/* Section Title */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white">
          <h2 className="text-lg font-medium text-gray-900">
            Institutional Submissions Register
          </h2>
        </div>

        {/* Filters Section */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <ReviewFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onExportCSV={() => exportToCSV(filteredData, "Registrar_All_Portal_Submissions_Report.csv")}
            onExportPDF={() => exportToPDF(filteredData, "Registrar_All_Portal_Submissions_Report.pdf")}
          />
        </div>

        {/* Data States & Table */}
        <div className="bg-white">
          {isLoading ? (
            <div className="py-12 text-center text-sm font-medium text-gray-500">
              Loading submissions data...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm font-medium text-red-600">
              {error}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-12 text-center text-sm font-medium text-gray-500">
              No matching records found.
            </div>
          ) : (
            <ReviewQueueTable data={filteredData} onRowClick={handleRowClick} />
          )}
        </div>
      </Card>

      <ReviewDrawer
        isOpen={isDrawerOpen}
        submission={selectedSubmission}
        onClose={() => setIsDrawerOpen(false)}
        onAction={() => {}}
      />
    </div>
  );
};

export default RegistrarDashboard;