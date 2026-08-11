import React, { useState, useEffect } from "react";
import { getSubmissions, updateSubmission, deleteSubmission, markClaimAsPaid } from "../../../services/submissionService";
import { exportToCSV, exportToPDF } from "../../../utils/exportUtils";
import { 
  FileText, 
  FileSpreadsheet,
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  X, 
  Loader2, 
  DollarSign, 
  Building,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Download
} from "lucide-react";
import ReviewDrawer from "../../DepartmentReview/Dashboard/components/ReviewDrawer";

const AllSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  
  // Drawer & Edit Modal state
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    department: "",
    status: "",
    paymentStatus: "",
    userShare: 0,
    firstVerification: "",
    secondVerification: "",
  });

  const loadAllSubmissions = async () => {
    setLoading(true);
    try {
      const res = await getSubmissions({});
      const data = res.data || res.claims || [];
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load all submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllSubmissions();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete submission "${title || id}" from the database?`)) return;
    try {
      await deleteSubmission(id);
      await loadAllSubmissions();
    } catch (err) {
      alert("Failed to delete submission: " + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenEdit = (claim) => {
    setEditingClaim(claim);
    setEditFormData({
      title: claim.title || "",
      department: claim.department || claim.creatorDept || "",
      status: claim.originalStatus || claim.status || "DEPARTMENT_REVIEW",
      paymentStatus: claim.isPaid ? "PAID" : (claim.paymentStatus || "UNPAID"),
      userShare: claim.userShare || claim.individualShare || claim.approvedAmount || 0,
      firstVerification: claim.fields?.firstVerification || claim.metadata?.firstVerification || "",
      secondVerification: claim.fields?.secondVerification || claim.metadata?.secondVerification || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingClaim) return;
    try {
      const claimId = editingClaim.id || editingClaim._id;
      const isPaidValue = editFormData.paymentStatus === "PAID";
      
      const payload = {
        title: editFormData.title,
        department: editFormData.department,
        status: editFormData.status,
        paymentStatus: editFormData.paymentStatus,
        isPaid: isPaidValue,
        approvedAmount: Number(editFormData.userShare),
        metadata: {
          ...(editingClaim.metadata || {}),
          title: editFormData.title,
          department: editFormData.department,
          firstVerification: editFormData.firstVerification,
          secondVerification: editFormData.secondVerification,
        }
      };

      await updateSubmission(claimId, payload);

      if (isPaidValue && !editingClaim.isPaid) {
        await markClaimAsPaid(claimId, "Marked as paid by Admin.");
      }

      setEditingClaim(null);
      await loadAllSubmissions();
    } catch (err) {
      alert("Error updating submission: " + (err.response?.data?.message || err.message));
    }
  };

  // Departments list from loaded data
  const departments = Array.from(new Set(submissions.map(s => s.department || s.creatorDept).filter(Boolean)));

  // Filtered submissions
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch = 
      !search.trim() ||
      String(item.title || "").toLowerCase().includes(search.toLowerCase()) ||
      String(item.claimNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      String(item.creatorName || "").toLowerCase().includes(search.toLowerCase()) ||
      String(item.department || "").toLowerCase().includes(search.toLowerCase());

    const statusStr = String(item.originalStatus || item.status || "").toUpperCase();
    let matchesStatus = true;
    if (statusFilter !== "ALL") {
      if (statusFilter === "DRAFT") matchesStatus = statusStr.includes("DRAFT");
      else if (statusFilter === "DEPARTMENT_REVIEW") matchesStatus = statusStr.includes("DEPARTMENT") || statusStr.includes("HOD") || statusStr.includes("PRINCIPAL");
      else if (statusFilter === "RPC_VERIFICATION") matchesStatus = statusStr.includes("RPC") || statusStr.includes("R & D");
      else if (statusFilter === "ACCOUNTS_PROCESSING") matchesStatus = statusStr.includes("ACCOUNT");
      else if (statusFilter === "COMPLETED") matchesStatus = statusStr.includes("COMPLETED") || statusStr.includes("APPROVED");
      else if (statusFilter === "RETURNED") matchesStatus = statusStr.includes("RETURN");
      else if (statusFilter === "REJECTED") matchesStatus = statusStr.includes("REJECT");
    }

    let matchesPayment = true;
    if (paymentFilter !== "ALL") {
      if (paymentFilter === "PAID") matchesPayment = item.isPaid || item.paymentStatus === "PAID";
      else if (paymentFilter === "UNPAID") matchesPayment = !item.isPaid && item.paymentStatus !== "PAID";
    }

    let matchesDept = true;
    if (deptFilter !== "ALL") {
      matchesDept = (item.department || item.creatorDept) === deptFilter;
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDept;
  });

  // Calculate Metrics
  const totalSubmissions = submissions.length;
  const totalPaidSum = submissions.reduce((acc, curr) => curr.isPaid ? acc + Number(curr.userShare || curr.approvedAmount || 0) : acc, 0);
  const pendingCount = submissions.filter(s => !String(s.status || "").toUpperCase().includes("COMPLETED") && !String(s.status || "").toUpperCase().includes("DRAFT")).length;
  const rejectedCount = submissions.filter(s => String(s.status || "").toUpperCase().includes("REJECT") || String(s.status || "").toUpperCase().includes("RETURN")).length;

  // Export Report Handlers
  const handleExportCSV = () => {
    exportToCSV(
      filteredSubmissions, 
      `MMDU_Admin_Submissions_Report_${deptFilter.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  const handleExportPDF = () => {
    exportToPDF(
      filteredSubmissions, 
      `MMDU_Admin_Submissions_Statement`, 
      {
        financialYear: "2026-2027",
        filterScope: `Status: ${statusFilter} • Payment: ${paymentFilter} • Dept: ${deptFilter}`
      }
    );
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto p-2 sm:p-4">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-neutral-100 rounded-lg text-neutral-800">
              <ShieldCheck className="h-5 w-5 text-[#8C0404]" />
            </span>
            <h1 className="text-2xl font-bold text-neutral-900">
              Universal Submissions Overseer
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Universal Administrative Access to inspect, edit, track workflow approval progress, verify payouts, generate reports, and delete any claim.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer"
            title="Download CSV report of current submissions"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Download CSV Report
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors shadow-sm cursor-pointer"
            title="Download printable PDF statement of current submissions"
          >
            <FileText className="h-4 w-4" />
            Download PDF Statement
          </button>

          <button
            onClick={loadAllSubmissions}
            className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Portal Claims</p>
            <h3 className="text-2xl font-black text-neutral-900 mt-0.5">{totalSubmissions}</h3>
          </div>
          <div className="h-10 w-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Amount Paid</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">₹{totalPaidSum.toLocaleString("en-IN")}</h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Active Review Queue</p>
            <h3 className="text-2xl font-black text-amber-600 mt-0.5">{pendingCount}</h3>
          </div>
          <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Rejected / Returned</p>
            <h3 className="text-2xl font-black text-rose-600 mt-0.5">{rejectedCount}</h3>
          </div>
          <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-700">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* SEARCH */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search Claim #, Title, Applicant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 outline-none focus:border-neutral-900 focus:bg-white transition-all"
            />
          </div>

          {/* STATUS FILTER */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 outline-none focus:border-neutral-900 focus:bg-white transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft Only</option>
              <option value="DEPARTMENT_REVIEW">Pending Dept (HOD / Principal)</option>
              <option value="RPC_VERIFICATION">Pending R & D Review</option>
              <option value="ACCOUNTS_PROCESSING">Pending Accounts Review</option>
              <option value="COMPLETED">Approved & Paid</option>
              <option value="RETURNED">Revision Requested</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* PAYMENT FILTER */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 outline-none focus:border-neutral-900 focus:bg-white transition-all"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PAID">Paid Only (Green)</option>
              <option value="UNPAID">Unpaid / Pending Release</option>
            </select>
          </div>

          {/* DEPARTMENT FILTER */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 outline-none focus:border-neutral-900 focus:bg-white transition-all"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-6 w-6 text-neutral-400 animate-spin" />
            <span className="text-xs font-semibold text-neutral-500">Loading claims from database...</span>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400 font-medium">
            No submissions matched your search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                  <th className="p-4">Claim #</th>
                  <th className="p-4">Title & Details</th>
                  <th className="p-4">Applicant & Dept</th>
                  <th className="p-4">Workflow Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {filteredSubmissions.map((claim) => {
                  const id = claim.id || claim._id;
                  const isPaid = claim.isPaid || claim.paymentStatus === "PAID";
                  const share = claim.userShare || claim.individualShare || claim.approvedAmount || 0;

                  return (
                    <tr key={id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* CLAIM NUMBER */}
                      <td className="p-4 font-bold text-neutral-900 whitespace-nowrap">
                        {claim.claimNumber || id.substring(0, 8)}
                      </td>

                      {/* TITLE */}
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-neutral-900 leading-snug line-clamp-1">
                          {claim.title || "Untitled Submission"}
                        </div>
                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">
                          {claim.category || claim.subtype || "General"}
                        </div>
                      </td>

                      {/* APPLICANT */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-semibold text-neutral-800">{claim.creatorName || "N/A"}</div>
                        <div className="text-[10px] text-neutral-400 font-medium">{claim.department || claim.creatorDept || "N/A"}</div>
                      </td>

                      {/* WORKFLOW STATUS */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          String(claim.status).includes("Approved") || String(claim.status).includes("Completed") ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                          String(claim.status).includes("Rejected") || String(claim.status).includes("Revision") ? "bg-rose-50 text-rose-800 border-rose-200" :
                          "bg-amber-50 text-amber-800 border-amber-200"
                        }`}>
                          {claim.status || "Unknown"}
                        </span>
                      </td>

                      {/* PAYMENT STATUS */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${
                          isPaid ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}>
                          {isPaid ? <CheckCircle size={10} /> : <Clock size={10} />}
                          {isPaid ? "PAID" : "UNPAID"}
                        </span>
                      </td>

                      {/* AMOUNT */}
                      <td className="p-4 font-bold text-neutral-900 whitespace-nowrap">
                        ₹{Number(share).toLocaleString("en-IN")}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* VIEW DETAILS */}
                          <button
                            onClick={() => {
                              setSelectedClaim(claim);
                              setDrawerOpen(true);
                            }}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                            title="View Full Details & Approval Flow"
                          >
                            <Eye size={15} />
                          </button>

                          {/* EDIT */}
                          <button
                            onClick={() => handleOpenEdit(claim)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Submission & Status"
                          >
                            <Edit3 size={15} />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => handleDelete(id, claim.title)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Submission"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FULL DETAILS REVIEW DRAWER */}
      {drawerOpen && selectedClaim && (
        <ReviewDrawer
          isOpen={drawerOpen}
          submission={selectedClaim}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedClaim(null);
          }}
          onAction={() => {}}
        />
      )}

      {/* EDIT MODAL */}
      {editingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-xl w-full p-6 text-left space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Edit Submission (Admin Override)</h3>
                <p className="text-xs text-neutral-400">Claim #{editingClaim.claimNumber || editingClaim._id}</p>
              </div>
              <button
                onClick={() => setEditingClaim(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">Title of Work</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    required
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold outline-none focus:border-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">Workflow Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold outline-none focus:border-neutral-900 focus:bg-white"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="DEPARTMENT_REVIEW">DEPARTMENT_REVIEW (HOD/Principal)</option>
                    <option value="RPC_VERIFICATION">RPC_VERIFICATION (R & D Cell)</option>
                    <option value="ACCOUNTS_PROCESSING">ACCOUNTS_PROCESSING (Finance)</option>
                    <option value="COMPLETED">COMPLETED (Approved & Paid)</option>
                    <option value="RETURNED">RETURNED (Revision Requested)</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">Payment Status</label>
                  <select
                    value={editFormData.paymentStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold outline-none focus:border-neutral-900 focus:bg-white"
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">Payable Share (₹)</label>
                  <input
                    type="number"
                    value={editFormData.userShare}
                    onChange={(e) => setEditFormData({ ...editFormData, userShare: e.target.value })}
                    required
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold outline-none focus:border-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">Primary Verification Link (DOI / Proceeding)</label>
                <input
                  type="text"
                  value={editFormData.firstVerification}
                  onChange={(e) => setEditFormData({ ...editFormData, firstVerification: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">Secondary Verification Link (Scopus / Indexing)</label>
                <input
                  type="text"
                  value={editFormData.secondVerification}
                  onChange={(e) => setEditFormData({ ...editFormData, secondVerification: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold outline-none focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingClaim(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8C0404] hover:bg-[#6F0303] text-white font-bold rounded-xl shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSubmissions;
