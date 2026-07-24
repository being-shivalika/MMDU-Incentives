import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSubmission } from "../hooks/useSubmission";
import { useWorkflowActions } from "../hooks/useWorkflowActions";
import { ReviewDrawer } from "../components/desk/ReviewDrawer";
import { ClaimTimeline } from "../components/timeline/ClaimTimeline";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../contexts/AuthContext";
import { getDeskStateConfig, DESK_STATES } from "../config/workflowDesks";
import { getInternalFaculty } from "../../../services/mockData";
import { ArrowLeft, Loader2, ShieldCheck, FileText, AlertTriangle, ExternalLink, User, CheckCircle2 } from "lucide-react";

export const ClaimDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, triggerDataRefresh } = useAuth();
  const { submission, loading, error, handleTransition } = useSubmission(id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentStatus = submission?.status || DESK_STATES.DRAFT;
  const deskConfig = getDeskStateConfig(currentStatus);
  const isAssignedRole = deskConfig.requiredRole === user?.role;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gray-400" />
        <span className="text-xs text-brand-gray-400 font-medium">Retrieving Claim File folder...</span>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white border border-brand-gray-250 rounded-md shadow-sm space-y-4 my-12">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-brand-gray-900">Claim File Not Found</h2>
        <p className="text-xs text-brand-gray-500">The file folder cannot be retrieved or you lack authorization to review it.</p>
        <Button onClick={() => navigate(-1)} className="text-xs">Back</Button>
      </div>
    );
  }

  const getBadgeStyle = (status) => {
    const config = getDeskStateConfig(status);
    switch (config.badgeVariant) {
      case "success": return "bg-green-50 text-green-700 border-green-200";
      case "danger": return "bg-red-50 text-red-700 border-red-200";
      case "warning": return "bg-amber-50 text-amber-700 border-amber-200";
      case "info": return "bg-blue-50 text-blue-700 border-blue-200";
      case "purple": return "bg-purple-50 text-purple-700 border-purple-200";
      case "orange": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-brand-gray-50 text-brand-gray-700 border-brand-gray-200";
    }
  };

  const getFacultyName = (employeeId) => {
    const found = getInternalFaculty().find((f) => f.employeeId === employeeId);
    return found ? `${found.name} (${found.employeeId})` : employeeId;
  };

  const metadataEntries = Object.entries(submission.metadata || {}).filter(([key]) => key !== "authors");

  const handleActionTransition = async (claimId, actionType, comment) => {
    await handleTransition(actionType, comment);
    // Refresh auth context so sidebar counters switch correctly
    triggerDataRefresh();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 text-left">
      {/* Header sheet */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-gray-150 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs text-brand-gray-400 hover:text-black font-semibold transition-colors mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Queue
          </button>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-bold text-brand-gray-400">{submission.id}</span>
            <span className="text-brand-gray-300">•</span>
            <span className="text-brand-gray-400 capitalize font-bold">{submission.typeId?.replace(/_/g, " ")}</span>
          </div>
          <h1 className="text-xl font-bold text-brand-gray-900 leading-snug">{submission.title}</h1>
          <div className="pt-1.5 flex items-center gap-2">
            <span className="text-xs text-brand-gray-400 font-semibold">Current Desk:</span>
            <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getBadgeStyle(submission.status)}`}>
              {deskConfig.label}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {isAssignedRole && !deskConfig.terminal && (
            <Button
              onClick={() => setDrawerOpen(true)}
              className="text-xs flex items-center gap-1.5 px-4 py-2.5 bg-black hover:bg-brand-gray-800 text-white font-bold shadow-sm"
            >
              <ShieldCheck className="h-4.5 w-4.5" />
              Evaluate Claim File
            </Button>
          )}

          {submission.status === DESK_STATES.RETURNED && submission.creatorId === user?.id && (
            <Button
              onClick={() => navigate(`/submissions/submit?type=${submission.typeId}&id=${submission.id}`)}
              className="text-xs flex items-center gap-1.5 px-4 py-2.5 bg-black hover:bg-brand-gray-800 text-white font-bold"
            >
              Update Claim & Resubmit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Claim sheet metadata */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 border border-brand-gray-200 bg-white shadow-sm space-y-4">
            <div className="border-b border-brand-gray-100 pb-2.5 flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-brand-gray-500" />
              <h3 className="text-xs font-bold text-brand-gray-700 uppercase tracking-wider">
                Claim Sheet Metadata
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-0.5 border-b border-brand-gray-50 pb-2">
                <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider block">Submitted By</span>
                <p className="text-sm font-semibold text-brand-gray-800">{submission.creatorName} ({submission.creatorDept})</p>
              </div>
              <div className="space-y-0.5 border-b border-brand-gray-50 pb-2">
                <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider block">Date Logged</span>
                <p className="text-sm font-semibold text-brand-gray-800">
                  {submission.dateSubmitted ? new Date(submission.dateSubmitted).toLocaleString() : "Draft"}
                </p>
              </div>

              {metadataEntries.map(([key, val]) => (
                <div key={key} className="space-y-0.5 border-b border-brand-gray-50 pb-2 last:border-0 last:pb-0">
                  <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider block">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  {typeof val === "string" && (val.startsWith("http://") || val.startsWith("https://")) ? (
                    <a
                      href={val}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-blue-500 hover:text-black font-bold flex items-center gap-0.5 mt-0.5"
                    >
                      Verify Link
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-brand-gray-800">
                      {typeof val === "boolean" ? (val ? "Yes" : "No") : String(val)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Author Directory list */}
            {submission.metadata?.authors && (
              <div className="mt-6 pt-4 border-t border-brand-gray-150 space-y-2">
                <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider block">
                  Academic Author Contributors (Non-Editable)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {submission.metadata.authors.firstAuthor && (
                    <div className="p-3 bg-brand-gray-50 border border-brand-gray-200 rounded">
                      <span className="text-[9px] text-brand-gray-400 font-bold uppercase tracking-wider block">First Author</span>
                      <span className="text-xs font-bold text-brand-gray-800 block mt-1">
                        {getFacultyName(submission.metadata.authors.firstAuthor)}
                      </span>
                    </div>
                  )}
                  {submission.metadata.authors.correspondingAuthor && (
                    <div className="p-3 bg-brand-gray-50 border border-brand-gray-200 rounded">
                      <span className="text-[9px] text-brand-gray-400 font-bold uppercase tracking-wider block">Corresponding Author</span>
                      <span className="text-xs font-bold text-brand-gray-800 block mt-1">
                        {getFacultyName(submission.metadata.authors.correspondingAuthor)}
                      </span>
                    </div>
                  )}
                  {submission.metadata.authors.coAuthors && submission.metadata.authors.coAuthors.length > 0 && (
                    <div className="p-3 bg-brand-gray-50 border border-brand-gray-200 rounded col-span-1 md:col-span-3">
                      <span className="text-[9px] text-brand-gray-400 font-bold uppercase tracking-wider block mb-1">Co-Authors</span>
                      <div className="flex flex-wrap gap-2">
                        {submission.metadata.authors.coAuthors.map((id) => (
                          <span key={id} className="text-xs bg-white border border-brand-gray-250 px-2 py-0.5 rounded font-semibold text-brand-gray-800">
                            {getFacultyName(id)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Timeline audit log */}
        <div className="space-y-6">
          <Card className="p-5 border border-brand-gray-200 bg-white shadow-sm">
            <ClaimTimeline history={submission.approvalHistory} />
          </Card>

          {/* Accounts-specific display card */}
          {(user?.role === "accounts" || submission.status === DESK_STATES.COMPLETED) && submission.incentiveAmount > 0 && (
            <Card className="p-5 border border-green-200 bg-green-50/40 shadow-sm space-y-3">
              <div className="border-b border-green-100 pb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-green-700" />
                <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider">Accounts Payout Sheet</h4>
              </div>
              <div className="text-xs space-y-1.5 font-semibold text-brand-gray-700">
                <div className="flex justify-between">
                  <span>Policy Reference</span>
                  <span className="text-black font-bold uppercase">Section 8: Research Incentives</span>
                </div>
                <div className="flex justify-between">
                  <span>Sanction Amount</span>
                  <span className="text-green-700 font-bold">₹{submission.incentiveAmount}</span>
                </div>
                {submission.paymentDetails && (
                  <>
                    <div className="flex justify-between">
                      <span>Voucher Transaction ID</span>
                      <span className="font-mono font-bold text-black">{submission.paymentDetails.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="text-green-600 font-bold">PAID</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <ReviewDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        submission={submission}
        onTransition={handleActionTransition}
        user={user}
      />
    </div>
  );
};
