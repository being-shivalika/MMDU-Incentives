import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  CheckSquare,
  Square,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  RotateCcw,
  Building2,
  BookOpen,
  DollarSign
} from "lucide-react";
import Card from "../../../components/Ui/Card";
import Badge from "../../../components/Ui/Badge";
import { getSubmissions, markClaimAsPaid, markBatchClaimsAsPaid, approveClaimPayment } from "../../../services/submissionService";
import useSubmissionSync from "../../../hooks/useSubmissionSync";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";

const DEPARTMENTS = [
  "All Departments",
  "Computer Science & Engineering",
  "Pharmacy",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Management",
  "Biotechnology",
  "Physics",
  "Chemistry",
  "Mathematics"
];

const CATEGORIES = [
  "All Categories",
  "research_publications",
  "conferences",
  "books_chapters",
  "intellectual_property",
  "innovation_projects"
];

const PAYOUT_STATUSES = [
  "All Statuses",
  "UNPAID",
  "PAID",
  "HELD"
];

const PaymentQueue = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter States
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [catFilter, setCatFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSubmissions();
      const data = res.data || res.claims || [];
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions for Accounts queue", err);
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
    setDeptFilter("All Departments");
    setCatFilter("All Categories");
    setStatusFilter("All Statuses");
    setStartDate("");
    setEndDate("");
  };

  // Comprehensive Filter Logic (Department, Category, Status, Date Range, Search)
  const eligibleQueue = submissions.filter((item) => {
    const status = (item.status || "").toLowerCase();
    const origStatus = (item.originalStatus || "").toLowerCase();
    
    // Base eligibility: Candidates that reached Accounts, approved by Accounts, or Completed
    const isCandidate =
      item.isAccountsApproved === true ||
      item.isPaid === true ||
      item.paymentStatus === "APPROVED_BY_ACCOUNTS" ||
      item.paymentStatus === "READY_FOR_RELEASE" ||
      item.paymentStatus === "PAID" ||
      status === "approved" ||
      status === "completed" ||
      status.includes("accounts") ||
      status.includes("disbursed") ||
      status.includes("paid") ||
      origStatus === "accounts_processing" ||
      origStatus === "completed" ||
      origStatus === "approved_by_accounts" ||
      item.currentLevel === "Accounts" ||
      item.currentLevel === "Completed";

    if (!isCandidate) return false;

    // 1. Department Filter
    const itemDept = item.creatorDept || item.department || "";
    if (deptFilter !== "All Departments" && itemDept.toLowerCase() !== deptFilter.toLowerCase()) {
      return false;
    }

    // 2. Category Filter
    if (catFilter !== "All Categories" && item.category !== catFilter) {
      return false;
    }

    // 3. Payout Status Filter
    const isItemPaid = item.isPaid || item.paymentStatus === "PAID";
    const isItemHeld = item.isHeld || false;
    if (statusFilter === "UNPAID" && (isItemPaid || isItemHeld)) return false;
    if (statusFilter === "PAID" && !isItemPaid) return false;
    if (statusFilter === "HELD" && !isItemHeld) return false;

    // 4. Date Range Filter
    const itemDate = new Date(item.dateSubmitted || item.createdAt || Date.now());
    if (startDate) {
      const start = new Date(startDate);
      if (itemDate < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (itemDate > end) return false;
    }

    // 5. Search Term Filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const matches =
        (item.claimNumber && item.claimNumber.toLowerCase().includes(query)) ||
        (item.id && item.id.toLowerCase().includes(query)) ||
        (item.creatorName && item.creatorName.toLowerCase().includes(query)) ||
        (item.applicantName && item.applicantName.toLowerCase().includes(query)) ||
        (item.title && item.title.toLowerCase().includes(query)) ||
        (itemDept && itemDept.toLowerCase().includes(query));
      if (!matches) return false;
    }

    return true;
  });

  // Toggle single selection
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (selectedIds.length === eligibleQueue.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(eligibleQueue.map((item) => item.id || item._id));
    }
  };

  // Selected objects
  const selectedItems = eligibleQueue.filter((item) =>
    selectedIds.includes(item.id || item._id)
  );

  const totalSelectedAmount = selectedItems.reduce((acc, item) => {
    const share = Number(
      item.userShare || item.individualShare || item.approvedAmount || item.totalIncentive || 0
    );
    return acc + (isNaN(share) ? 0 : share);
  }, 0);

  // Single Step 1: Approve Payment Action
  const handleSingleApprovePayment = async (id) => {
    try {
      setProcessing(true);
      setSuccessMessage(null);
      await approveClaimPayment(id, "Incentive amount verified and approved by Accounts for annual payout cycle.");
      setSuccessMessage("Incentive claim payment APPROVED by Accounts successfully!");
      await loadSubmissions();
    } catch (err) {
      console.error("Error approving claim payment:", err);
      alert(err.message || "Failed to approve claim payment.");
    } finally {
      setProcessing(false);
    }
  };

  // Single Step 2: Mark as Paid Action
  const handleSingleMarkPaid = async (id) => {
    try {
      setProcessing(true);
      setSuccessMessage(null);
      await markClaimAsPaid(id, "Ticked and marked as paid in annual disbursement cycle.");
      setSuccessMessage("Incentive claim marked as PAID successfully!");
      await loadSubmissions();
    } catch (err) {
      console.error("Error marking claim as paid:", err);
      alert(err.message || "Failed to mark claim as paid.");
    } finally {
      setProcessing(false);
    }
  };

  // Bulk Mark Selected as Paid Action
  const handleBulkMarkPaid = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one incentive claim to mark as paid.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to mark ${selectedIds.length} selected claim(s) totaling ₹${totalSelectedAmount.toLocaleString(
          "en-IN"
        )} as PAID for this Annual Disbursement Cycle?`
      )
    ) {
      return;
    }

    setProcessing(true);
    setSuccessMessage(null);

    try {
      await markBatchClaimsAsPaid(selectedIds, "Annual Incentive Payment Disbursed & Bank Credited.");
      setSuccessMessage(
        `Successfully processed and marked ${selectedIds.length} incentive claim(s) as PAID!`
      );
      setSelectedIds([]);
      await loadSubmissions();
    } catch (err) {
      console.error("Error processing annual payment batch:", err);
      alert(err.message || "Failed to process annual payment batch.");
    } finally {
      setProcessing(false);
    }
  };

  // Export handlers (Export CSV & PDF based on current active filters)
  const handleExportCSV = () => {
    const target = selectedItems.length > 0 ? selectedItems : eligibleQueue;
    exportToCSV(target, `MMDU_Annual_Incentives_Disbursement_${deptFilter.replace(/\s+/g, '_')}_FY2026.csv`);
  };

  const handleExportPDF = () => {
    const target = selectedItems.length > 0 ? selectedItems : eligibleQueue;
    exportToPDF(target, `MMDU_Annual_Incentive_Statement`, {
      financialYear: "2026-2027",
      filterScope: `${deptFilter} • ${catFilter} • ${statusFilter} ${startDate ? `• From ${startDate}` : ''} ${endDate ? `to ${endDate}` : ''}`
    });
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto p-2 sm:p-4">
      {/* Header */}
      <PageHeader
        title="Annual Payment Queue & Disbursement"
        subtitle="Filter claims by Department, Category, Payout Status, and Date Range. Download CSV or PDF statements with all submission fields."
        icon={CreditCard}
      />

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs text-emerald-700 underline font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter & Actions Panel */}
      <Card className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
        {/* Row 1: Search & Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search Claim #, Faculty, Title..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs font-medium cursor-pointer"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs font-medium cursor-pointer capitalize"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Payout Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs font-medium cursor-pointer"
            >
              {PAYOUT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "UNPAID" ? "Unpaid / Pending" : s === "PAID" ? "Paid / Disbursed" : s === "HELD" ? "Held" : "All Statuses"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Date Range & Export Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2 border-t border-neutral-100">
          {/* Date Range Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Date Range:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 cursor-pointer"
            />
            <span className="text-xs text-neutral-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 cursor-pointer"
            />
            {(deptFilter !== "All Departments" || catFilter !== "All Categories" || statusFilter !== "All Statuses" || startDate || endDate || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 ml-1 cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          {/* Export & Batch Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer"
              title="Download CSV bank statement for current filters"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Download CSV
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
              title="Download print-ready PDF statement for current filters"
            >
              <FileText className="h-4 w-4" />
              Download PDF Statement
            </button>

            <button
              onClick={handleBulkMarkPaid}
              disabled={selectedIds.length === 0 || processing}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer ${
                selectedIds.length > 0 && !processing
                  ? "bg-neutral-950 text-white hover:bg-neutral-800 active:scale-95"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {processing
                ? "Processing..."
                : selectedIds.length > 0
                ? `Mark ${selectedIds.length} Selected as Paid (₹${totalSelectedAmount.toLocaleString("en-IN")})`
                : "Mark Selected as Paid"}
            </button>
          </div>
        </div>

        {/* Selection Bar Summary */}
        <div className="flex items-center justify-between text-xs font-medium text-neutral-600 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-1.5 text-neutral-800 font-bold hover:text-neutral-950 cursor-pointer"
            >
              {selectedIds.length > 0 && selectedIds.length === eligibleQueue.length ? (
                <CheckSquare className="h-4 w-4 text-neutral-900" />
              ) : (
                <Square className="h-4 w-4 text-neutral-400" />
              )}
              <span>
                {selectedIds.length === eligibleQueue.length && eligibleQueue.length > 0
                  ? "Deselect All"
                  : "Select All Claims"}
              </span>
            </button>
            <span className="text-neutral-300">•</span>
            <span>
              Showing: <strong className="text-neutral-900">{eligibleQueue.length}</strong> filtered claims (Selected: <strong>{selectedIds.length}</strong>)
            </span>
          </div>

          <div>
            Total Selected Amount:{" "}
            <strong className="text-emerald-800 font-bold text-sm">
              ₹{totalSelectedAmount.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>
      </Card>

      {/* Main Table Card */}
      <Card className="p-0 overflow-hidden bg-white border border-neutral-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-bold tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <button onClick={handleToggleSelectAll} className="cursor-pointer">
                    {selectedIds.length > 0 && selectedIds.length === eligibleQueue.length ? (
                      <CheckSquare className="h-4 w-4 text-neutral-950" />
                    ) : (
                      <Square className="h-4 w-4 text-neutral-400" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Claim ID</th>
                <th className="py-3.5 px-4">Faculty / Applicant</th>
                <th className="py-3.5 px-4">Category & Title</th>
                <th className="py-3.5 px-4">Financial Year</th>
                <th className="py-3.5 px-4 text-right">Faculty Share</th>
                <th className="py-3.5 px-4 text-center">Annual Payout Status</th>
                <th className="py-3.5 px-4 text-right">Manual Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Clock className="h-6 w-6 text-neutral-300 animate-spin" />
                      <span>Loading annual payment queue...</span>
                    </div>
                  </td>
                </tr>
              ) : eligibleQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="h-6 w-6 text-neutral-300" />
                      <span className="font-bold text-neutral-800 text-sm">
                        No claims match the active filters
                      </span>
                      <span className="text-xs">
                        Try clearing or adjusting your Department, Category, Status, or Date filters.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                eligibleQueue.map((item) => {
                  const id = item.id || item._id;
                  const isChecked = selectedIds.includes(id);
                  const share = Number(
                    item.userShare || item.individualShare || item.approvedAmount || item.totalIncentive || 0
                  );
                  const isHeld = item.isHeld || false;
                  const isPaid = item.isPaid || item.paymentStatus === "PAID";
                  const isAccountsApproved = item.isAccountsApproved || item.paymentStatus === "APPROVED_BY_ACCOUNTS" || item.paymentStatus === "READY_FOR_RELEASE" || item.status === "COMPLETED";

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-neutral-50/80 transition-colors ${
                        isChecked ? "bg-neutral-50/90 font-semibold" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(id)}
                          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                        />
                      </td>

                      {/* Claim Number */}
                      <td className="py-3.5 px-4 font-bold text-neutral-950">
                        {item.claimNumber || id}
                      </td>

                      {/* Faculty Name & Dept */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">
                          {item.creatorName || item.applicantName || "Faculty Member"}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-medium">
                          {item.creatorDept || item.department || "MMDU Department"}
                        </div>
                      </td>

                      {/* Title & Category */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-neutral-900 font-bold truncate" title={item.title}>
                          {item.title}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mt-0.5">
                          {(item.category || "").replace(/_/g, " ")} • {item.subtype || "Journal"}
                        </div>
                      </td>

                      {/* Financial Year */}
                      <td className="py-3.5 px-4 font-semibold text-neutral-600">
                        {item.financialYear || "2026-2027"}
                      </td>

                      {/* Amount Share */}
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-800 text-sm">
                        ₹{share.toLocaleString("en-IN")}
                      </td>

                      {/* Annual Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isHeld ? (
                          <Badge variant="warning">Held</Badge>
                        ) : isPaid ? (
                          <Badge variant="success">Paid / Disbursed</Badge>
                        ) : isAccountsApproved ? (
                          <Badge variant="info">Approved (Pending Credit)</Badge>
                        ) : share > 0 ? (
                          <Badge variant="warning">Unapproved Payout</Badge>
                        ) : (
                          <Badge variant="secondary">Not Applicable (₹0)</Badge>
                        )}
                      </td>

                      {/* Single Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        {isPaid ? (
                          <span className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 inline-block">
                            ✔ Paid
                          </span>
                        ) : share > 0 && !isHeld ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {!isAccountsApproved && (
                              <button
                                onClick={() => handleSingleApprovePayment(id)}
                                disabled={processing}
                                className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border bg-[#8C0404] text-white border-[#8C0404] hover:bg-[#6F0303] transition-colors cursor-pointer"
                              >
                                Approve Payment
                              </button>
                            )}
                            <button
                              onClick={() => handleSingleMarkPaid(id)}
                              disabled={processing}
                              className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border bg-neutral-950 text-white border-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                              Tick as Paid
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-neutral-400 italic">
                            {isHeld ? "Held" : "Not Applicable"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PaymentQueue;
