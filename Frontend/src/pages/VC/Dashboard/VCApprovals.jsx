import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import {
  CheckCircle,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  FileText,
  RotateCcw,
  RefreshCw
} from "lucide-react";
import { getSubmissions } from "../../../services/submissionService";
import { processTransition } from "../../../services/workflowService";
import ReviewDrawer from "../../DepartmentReview/Dashboard/components/ReviewDrawer";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";
import useSubmissionSync from "../../../hooks/useSubmissionSync";

const CATEGORIES = [
  { value: "All", label: "All Categories" },
  { value: "publication", label: "Journal Publications" },
  { value: "conference", label: "Conferences & Seminars" },
  { value: "book", label: "Books & Chapters" },
  { value: "patent", label: "Patents & IP" },
  { value: "copyright", label: "Copyrights" }
];

const VCApprovals = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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
      console.error("Failed to load approvals for Vice Chancellor:", err);
      setError(err.message || "Failed to load executive approvals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useSubmissionSync(loadSubmissions, 3000);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  // Filter Logic
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

    const itemCat = String(item.category || item.subtype || "").toLowerCase();
    const matchesCategory = selectedCategory === "All" || itemCat.includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const activeFiltersCount = (selectedCategory !== "All" ? 1 : 0) + (searchTerm ? 1 : 0);

  const handleExportCSV = () => {
    exportToCSV(
      filteredData,
      `MMDU_VC_Executive_Approvals_FY2026.csv`
    );
  };

  const handleExportPDF = () => {
    exportToPDF(
      filteredData,
      `MMDU_VC_Executive_Approvals_Statement`,
      {
        financialYear: "2026-2027",
        filterScope: `Category: ${selectedCategory}`
      }
    );
  };

  const handleRowClick = (item) => {
    setSelectedSubmission(item);
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
        claimId: selectedSubmission.id || selectedSubmission._id,
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
    <div className="space-y-6 text-left max-w-7xl mx-auto p-2 sm:p-4">
      <PageHeader
        title="Executive Approvals"
        subtitle="Review and authorize high-value grants and institutional research requests across MMDU."
        icon={CheckCircle}
      />

      {/* FILTER & CONTROL PANEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search approvals by title, applicant, ID..."
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
              title="Download CSV report of executive approvals"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Download CSV
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
              title="Download PDF statement of executive approvals"
            >
              <FileText className="h-4 w-4" />
              Download PDF
            </button>

            <button
              onClick={loadSubmissions}
              className="p-2 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-xl text-neutral-600 transition-colors cursor-pointer"
              title="Refresh executive approvals"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* EXPANDABLE FILTER OPTIONS PANEL */}
        {showFilters && (
          <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
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

            {activeFiltersCount > 0 && (
              <div className="sm:col-span-2 flex justify-end pt-1">
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                >
                  <RotateCcw size={12} /> Reset Filters
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
                <th className="p-4">Claim # & Date</th>
                <th className="p-4">Applicant & Dept</th>
                <th className="p-4">Submission Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Incentive Share</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 font-medium">
                    Loading executive approvals...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-rose-600 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">
                    No approval records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const id = item.id || item._id;
                  const share = Number(item.userShare || item.approvedAmount || item.estimatedIncentive || 0);

                  return (
                    <tr key={id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-mono font-bold text-neutral-900">{item.claimNumber || id.substring(0, 8)}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {new Date(item.dateSubmitted || item.createdAt || Date.now()).toLocaleDateString("en-GB")}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-neutral-900">{item.creatorName || item.applicantName || "Faculty Member"}</div>
                        <div className="text-[10px] text-neutral-500 font-medium">{item.creatorDept || item.department || "MMDU"}</div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-neutral-900 line-clamp-1">{item.title}</div>
                      </td>
                      <td className="p-4 font-semibold text-neutral-700">
                        {item.category || item.subtype || "General"}
                      </td>
                      <td className="p-4 font-bold text-emerald-800 text-sm">
                        ₹{share.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                          {item.status || "Pending Executive"}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleRowClick(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 text-xs font-bold transition-colors cursor-pointer"
                          title="Review submission details & approval action"
                        >
                          <Eye size={14} /> Review Request
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

      {/* REVIEW DRAWER */}
      {isDrawerOpen && selectedSubmission && (
        <ReviewDrawer
          isOpen={isDrawerOpen}
          submission={selectedSubmission}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedSubmission(null);
          }}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default VCApprovals;
