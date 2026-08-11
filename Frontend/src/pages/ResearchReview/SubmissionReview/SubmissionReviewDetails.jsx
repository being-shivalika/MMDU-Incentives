import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, XCircle, AlertCircle, 
  ExternalLink, Clock, FileText, User, Tag, ShieldCheck, Link2 
} from "lucide-react";
import dayjs from "dayjs";

import { getSubmissions, getSubmissionById } from "../../../services/submissionService";
import { processTransition } from "../../../services/workflowService";
import { ROUTES } from "../../../constants/routes";

import Badge from "../../../components/Ui/Badge";
import Card from "../../../components/Ui/Card";
import ActionButton from "../../../shared/components/ActionButton";

const SubmissionReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // RPC Analysis State
  const [remarks, setRemarks] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSubmissionById(id);
      const data = response.data || response;
      if (!data) {
        throw new Error("Submission not found");
      }
      setSubmission(data);
    } catch (err) {
      console.error("Error fetching submission details:", err);
      try {
        const responseAll = await getSubmissions();
        const allSubmissions = responseAll.data || responseAll.claims || [];
        const found = allSubmissions.find((s) => s.id === id || s._id === id);
        if (found) {
          setSubmission(found);
          return;
        }
      } catch {
        // ignore secondary error
      }
      setError(err.message || "Failed to load submission details");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionType) => {
    setValidationErrors({});
    const errors = {};

    if (actionType === "reject" || actionType === "return") {
      if (!remarks.trim()) errors.remarks = "Remarks are required for this action";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const computedAmount = submission?.userShare || submission?.individualShare || submission?.approvedAmount || submission?.calculatedAmount || submission?.totalIncentive;
      await processTransition({
        claimId: id,
        action: actionType,
        remarks: remarks,
        incentiveAmount: actionType === "approve" ? computedAmount : undefined
      });
      navigate(ROUTES.RESEARCH_REVIEW);
    } catch (err) {
      console.error("Error processing transition:", err);
      alert(err.message || "Failed to process review action");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500 font-medium">Loading research dossier...</div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <div className="text-red-500 font-medium">{error || "Submission not found"}</div>
        <button 
          onClick={() => navigate(ROUTES.RESEARCH_REVIEW)}
          className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 text-left">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <button 
          onClick={() => navigate(ROUTES.RESEARCH_REVIEW)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Submission Details - {id}</h1>
          <p className="text-sm text-gray-500">RPC / R&D Academic Evaluation</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={submission.status === "Approved" ? "success" : submission.status?.includes("Pending") ? "warning" : "default"}>
            {submission.status || "Unknown Status"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Faculty Information */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <User className="h-5 w-5 text-[#8C0404]" /> Faculty Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{submission.submittedBy || submission.creatorName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{submission.department || submission.creatorDept || "N/A"}</p>
              </div>
            </div>
          </Card>

          {/* Section 2: Research Information */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <FileText className="h-5 w-5 text-[#8C0404]" /> Research Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium text-gray-900 text-lg">{submission.title || "N/A"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Research Category</p>
                  <p className="font-medium text-gray-900">{submission.submissionType || submission.type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Publication Date</p>
                  <p className="font-medium text-gray-900">
                    {submission.submittedAt ? dayjs(submission.submittedAt).format("DD MMM YYYY") : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {submission.fields?.journalName || submission.metadata?.journalName ? "Name of Journal" : "Name of Conference / Seminar"}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {submission.fields?.journalName || submission.metadata?.journalName || submission.fields?.conferenceTitle || submission.metadata?.conferenceTitle || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Publisher</p>
                  <p className="font-medium text-gray-900">{submission.fields?.publisher || submission.metadata?.publisher || "N/A"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Quality Metrics */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Tag className="h-5 w-5 text-[#8C0404]" /> Quality Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#8C0404]/10 p-4 rounded-xl border border-[#8C0404]/20 text-center">
                <p className="text-xs text-[#8C0404] font-semibold uppercase mb-1">Quartile</p>
                <p className="font-bold text-[#8C0404] text-2xl">{submission.metadata?.quartile || submission.fields?.quartile || "N/A"}</p>
              </div>
              <div className="bg-[#8C0404]/10 p-4 rounded-xl border border-[#8C0404]/20 text-center">
                <p className="text-xs text-[#8C0404] font-semibold uppercase mb-1">Impact Factor</p>
                <p className="font-bold text-[#8C0404] text-2xl">{submission.metadata?.impactFactor || submission.fields?.impactFactor || "N/A"}</p>
              </div>
              <div className="bg-[#8C0404]/5 p-4 rounded-xl border border-[#8C0404]/20 text-center col-span-2 flex flex-col justify-center items-center">
                <p className="text-xs text-[#8C0404] font-semibold uppercase mb-1">Quartile Proof Link / Doc</p>
                {submission.metadata?.quartileProof || submission.fields?.quartileProof ? (
                  <a
                    href={submission.metadata?.quartileProof || submission.fields?.quartileProof}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#8C0404] hover:underline text-xs break-all flex items-center gap-1"
                  >
                    View Scimago / SJR Proof ↗
                  </a>
                ) : (
                  <p className="text-xs text-neutral-400 font-medium">No Proof URL</p>
                )}
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-center">
                <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">Volume No.</p>
                <p className="font-bold text-neutral-900 text-sm">{submission.metadata?.volumeNo || submission.fields?.volumeNo || "N/A"}</p>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-center">
                <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">Issue No.</p>
                <p className="font-bold text-neutral-900 text-sm">{submission.metadata?.issueNo || submission.fields?.issueNo || "N/A"}</p>
              </div>
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-center col-span-2">
                <p className="text-xs text-neutral-500 font-semibold uppercase mb-1">Page No.</p>
                <p className="font-bold text-neutral-900 text-sm">{submission.metadata?.pageNo || submission.fields?.pageNo || "N/A"}</p>
              </div>
            </div>
          </Card>
          
          {/* Section 6: RPC Analysis Workspace */}
          <Card className="border-l-4 border-l-[#8C0404]">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <ShieldCheck className="h-5 w-5 text-[#8C0404]" /> RPC Analysis & Final Decision
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Complete the analysis workspace below. This information will be forwarded to the Accounts department upon Final Approval.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Research Remarks & Observations <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={`w-full border ${validationErrors.remarks ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8C0404]'} rounded-lg p-3 text-sm focus:ring-2 outline-none transition-shadow`}
                  rows="4"
                  placeholder="Enter detailed validation remarks, quartile verification notes, etc..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  disabled={submitting}
                />
                {validationErrors.remarks && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.remarks}</p>
                )}
              </div>

              <div className="bg-[#8C0404]/10 border border-[#8C0404]/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8C0404] mb-0.5">
                    Policy Engine Calculated Incentive
                  </p>
                  <p className="text-xs text-[#8C0404]/80 font-medium">
                    Automatically calculated based on Research Promotion Policy (Q-Quartile, Author Split & Indexing).
                  </p>
                </div>
                <div className="text-2xl font-black text-[#8C0404] bg-white px-4 py-2 rounded-lg border border-[#8C0404]/30 shadow-sm shrink-0">
                  ₹{(submission?.userShare || submission?.individualShare || submission?.approvedAmount || submission?.calculatedAmount || submission?.totalIncentive || 0).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Section 4: Policy Eligibility */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <CheckCircle className="h-5 w-5 text-green-500" /> Policy Eligibility
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant="success">Eligible</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Category</span>
                <span className="text-sm font-medium">Q-Based Incentive</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 p-3 bg-gray-50 rounded-lg border">
                This publication meets the required criteria for Q-level institutional research incentives.
              </p>
            </div>
          </Card>

          {/* Section 7: Supporting Links */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Link2 className="h-5 w-5 text-[#8C0404]" /> Verification Links
            </h2>
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#8C0404]/40 hover:bg-[#8C0404]/5 transition-colors text-sm font-medium text-gray-700">
                <span>DOI Link</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#8C0404]/40 hover:bg-[#8C0404]/5 transition-colors text-sm font-medium text-gray-700">
                <span>Scopus Profile</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#8C0404]/40 hover:bg-[#8C0404]/5 transition-colors text-sm font-medium text-gray-700">
                <span>Publisher Site</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            </div>
          </Card>

          {/* Section 5: Review History Timeline */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Clock className="h-5 w-5 text-[#8C0404]" /> Review History
            </h2>
            <div className="relative pl-4 space-y-6 mt-4">
              <div className="absolute top-0 bottom-0 left-[11px] w-0.5 bg-gray-200"></div>
              
              <div className="relative">
                <div className="absolute -left-4 w-6 h-6 rounded-full bg-green-500 border-4 border-white"></div>
                <div className="pl-6">
                  <p className="text-sm font-bold text-gray-900">Faculty Submitted</p>
                  <p className="text-xs text-gray-500">{dayjs(submission.submittedAt).format("DD MMM YYYY, HH:mm")}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-4 w-6 h-6 rounded-full bg-green-500 border-4 border-white"></div>
                <div className="pl-6">
                  <p className="text-sm font-bold text-gray-900">HOD Approved</p>
                  <p className="text-xs text-gray-500">Verified department details</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-4 w-6 h-6 rounded-full bg-[#8C0404] border-4 border-white"></div>
                <div className="pl-6">
                  <p className="text-sm font-bold text-gray-900">RPC Verification</p>
                  <p className="text-xs text-gray-500">Currently under review</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky Action Panel */}
      {submission.permissions?.canApprove ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 justify-end lg:pr-64">
            <button 
              disabled={submitting}
              onClick={() => handleAction("return")}
              className="px-6 py-2.5 rounded-lg font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors disabled:opacity-50"
            >
              Return for Clarification
            </button>
            <button 
              disabled={submitting}
              onClick={() => handleAction("reject")}
              className="px-6 py-2.5 rounded-lg font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
            <ActionButton 
              disabled={submitting}
              onClick={() => handleAction("approve")}
              defaultText="FINAL APPROVAL"
              activeText="Processing..."
              className="px-8 py-2.5 bg-[#8C0404] hover:bg-[#6F0303] shadow-md"
            />
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider z-40">
          View Only Mode — Effective Approver: {submission.effectiveApprover?.label || 'Assigned Desk'}
        </div>
      )}
    </div>
  );
};

export default SubmissionReviewDetails;
