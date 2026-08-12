import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import {
  FolderSearch,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  RefreshCw,
  Award,
  Building2,
  BookOpen,
  CheckCircle2,
  Clock
} from "lucide-react";
import { getSubmissions } from "../../../services/submissionService";
import ReviewDrawer from "../../DepartmentReview/Dashboard/components/ReviewDrawer";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";
import useSubmissionSync from "../../../hooks/useSubmissionSync";

const DEPARTMENTS = [
  "All Departments",
  "Computer Science & Engineering",
  "MCA",
  "Information Technology",
  "Software Engineering",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Pharmacy",
  "Nursing",
  "Physiotherapy",
  "Law",
  "Medical Sciences",
  "Dental Sciences",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Humanities & Social Sciences",
];

const CATEGORIES = [
  { value: "All", label: "All Categories" },
  { value: "publication", label: "Journal Publications" },
  { value: "conference", label: "Conferences & Seminars" },
  { value: "book", label: "Books & Chapters" },
  { value: "patent", label: "Patents & IP" },
  { value: "copyright", label: "Copyrights" },
];

const STATUSES = [
  { value: "All", label: "All Statuses" },
  { value: "DEPARTMENT_REVIEW", label: "Pending Dept (HOD / Principal)" },
  { value: "RPC_VERIFICATION", label: "Pending R & D Review" },
  { value: "ACCOUNTS_PROCESSING", label: "Pending Accounts" },
  { value: "COMPLETED", label: "Completed / Approved" },
  { value: "RETURNED", label: "Revision Requested" },
  { value: "REJECTED", label: "Rejected" },
];

const RegistrarRecords = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Drawer state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSubmissions();
      const data = res.data || res.claims || [];
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load academic records for Registrar:", err);
      setError(err.message || "Failed to load academic records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useSubmissionSync(loadSubmissions, 3000);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDept("All Departments");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  // Filter Logic
  const filteredRecords = submissions.filter((item) => {
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

    const itemDept = item.department || item.creatorDept || "";
    const matchesDept = selectedDept === "All Departments" || itemDept.toLowerCase() === selectedDept.toLowerCase();

    const itemCat = String(item.category || item.subtype || "").toLowerCase();
    const matchesCategory = selectedCategory === "All" || itemCat.includes(selectedCategory.toLowerCase());

    const itemStatus = String(item.status || item.originalStatus || "").toUpperCase();
    let matchesStatus = true;
    if (selectedStatus !== "All") {
      if (selectedStatus === "DEPARTMENT_REVIEW") matchesStatus = itemStatus.includes("DEPARTMENT") || itemStatus.includes("HOD") || itemStatus.includes("PRINCIPAL");
      else if (selectedStatus === "RPC_VERIFICATION") matchesStatus = itemStatus.includes("RPC") || itemStatus.includes("R & D");
      else if (selectedStatus === "ACCOUNTS_PROCESSING") matchesStatus = itemStatus.includes("ACCOUNT");
      else if (selectedStatus === "COMPLETED") matchesStatus = itemStatus.includes("COMPLETED") || itemStatus.includes("APPROVED");
      else if (selectedStatus === "RETURNED") matchesStatus = itemStatus.includes("RETURN") || itemStatus.includes("REVISION");
      else if (selectedStatus === "REJECTED") matchesStatus = itemStatus.includes("REJECT");
    }

    return matchesSearch && matchesDept && matchesCategory && matchesStatus;
  });

  // Calculate Metrics
  const totalSubmissions = submissions.length;
  const approvedCount = submissions.filter(s => String(s.status || "").toUpperCase().includes("COMPLETED") || String(s.status || "").toUpperCase().includes("APPROVED")).length;
  const pendingCount = submissions.filter(s => !String(s.status || "").toUpperCase().includes("COMPLETED") && !String(s.status || "").toUpperCase().includes("REJECT") && !String(s.status || "").toUpperCase().includes("DRAFT")).length;
  const totalIncentiveSum = submissions.reduce((acc, curr) => acc + Number(curr.userShare || curr.approvedAmount || curr.estimatedIncentive || 0), 0);

  // Active filters count
  const activeFiltersCount = (selectedDept !== "All Departments" ? 1 : 0) + (selectedCategory !== "All" ? 1 : 0) + (selectedStatus !== "All" ? 1 : 0) + (searchTerm ? 1 : 0);

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(
      filteredRecords,
      `MMDU_Registrar_Academic_Records_${selectedDept.replace(/\s+/g, '_')}_FY2026.csv`
    );
  };

  const handleExportPDF = () => {
    exportToPDF(
      filteredRecords,
      `MMDU_Registrar_Academic_Records_Statement`,
      {
        financialYear: "2026-2027",
        filterScope: `Dept: ${selectedDept} • Category: ${selectedCategory} • Status: ${selectedStatus}`
      }
    );
  };

  const handleRowClick = (item) => {
    setSelectedSubmission(item);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto p-2 sm:p-4">
      <PageHeader
        title="Academic Records"
        subtitle="Consolidated portal research records and academic output of MMDU faculty across all departments."
        icon={FolderSearch}
      />

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Academic Claims</p>
            <h3 className="text-2xl font-black text-neutral-900 mt-0.5">{totalSubmissions}</h3>
          </div>
          <div className="h-10 w-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Approved Research</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{approvedCount}</h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Pending Review</p>
            <h3 className="text-2xl font-black text-amber-600 mt-0.5">{pendingCount}</h3>
          </div>
          <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Incentive Value</p>
            <h3 className="text-2xl font-black text-[#8C0404] mt-0.5">₹{totalIncentiveSum.toLocaleString("en-IN")}</h3>
          </div>
          <div className="h-10 w-10 bg-[#8C0404]/10 rounded-xl flex items-center justify-center text-[#8C0404]">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* FILTER & CONTROL PANEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden p-4 space-y-4">
        {/* Control Bar: Search, Filter Toggle & Export Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search faculty, title, department, ID..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 text-xs font-semibold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Buttons: Filter Toggle, CSV Export, PDF Export, Refresh */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                  : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              }`}
              title="Toggle detailed filter options"
            >
              <Filter size={15} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-[#8C0404] text-white font-extrabold rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer"
              title="Download CSV statement of filtered records"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Download CSV
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
              title="Download PDF statement of filtered records"
            >
              <FileText className="h-4 w-4" />
              Download PDF
            </button>

            <button
              onClick={loadSubmissions}
              className="p-2 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-xl text-neutral-600 transition-colors cursor-pointer"
              title="Refresh academic records"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* EXPANDABLE FILTER OPTIONS PANEL */}
        {showFilters && (
          <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
            {/* Department Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Research Category Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Research Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Workflow Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Reset bar if active */}
            {activeFiltersCount > 0 && (
              <div className="sm:col-span-3 flex justify-end pt-1">
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-bold tracking-wider border-b border-neutral-200 text-[10px]">
              <tr>
                <th className="p-4">Record / Claim #</th>
                <th className="p-4">Faculty / Applicant</th>
                <th className="p-4">Department</th>
                <th className="p-4">Research Category & Title</th>
                <th className="p-4">Incentive Share</th>
                <th className="p-4">Workflow Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 font-medium">
                    Loading academic research records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-rose-600 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">
                    No academic records match your active search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const id = item.id || item._id;
                  const share = Number(item.userShare || item.approvedAmount || item.estimatedIncentive || 0);

                  return (
                    <tr key={id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-neutral-900">
                        {item.claimNumber || id.substring(0, 8)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-neutral-900">{item.creatorName || item.applicantName || "Faculty Member"}</div>
                        <div className="text-[10px] text-neutral-400 font-medium">{item.creatorRole || "Faculty"}</div>
                      </td>
                      <td className="p-4 font-semibold text-neutral-800">
                        {item.department || item.creatorDept || "MMDU"}
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-neutral-900 line-clamp-1">{item.title}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5">
                          {item.category || item.subtype || "General"}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-emerald-800 text-sm">
                        ₹{share.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          String(item.status).includes("Approved") || String(item.status).includes("Completed") ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                          String(item.status).includes("Rejected") || String(item.status).includes("Revision") ? "bg-rose-50 text-rose-800 border-rose-200" :
                          "bg-amber-50 text-amber-800 border-amber-200"
                        }`}>
                          {item.status || "DEPARTMENT_REVIEW"}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleRowClick(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 text-xs font-bold transition-colors cursor-pointer"
                          title="View full record details & approval timeline"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL DETAILS REVIEW DRAWER */}
      {isDrawerOpen && selectedSubmission && (
        <ReviewDrawer
          isOpen={isDrawerOpen}
          submission={selectedSubmission}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedSubmission(null);
          }}
          onAction={() => {}}
        />
      )}
    </div>
  );
};

export default RegistrarRecords;
