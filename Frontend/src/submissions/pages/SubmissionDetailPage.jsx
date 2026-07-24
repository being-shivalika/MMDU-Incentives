import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSubmission } from "../hooks/useSubmission";
import { useWorkflowActions } from "../hooks/useWorkflowActions";
import { ReviewDrawer } from "../approvals/ReviewDrawer";
import { SubmissionTimeline } from "../components/timeline/SubmissionTimeline";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../contexts/AuthContext";
import { ArrowLeft, Loader2, ShieldCheck, FileText, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { WORKFLOW_DEFINITIONS } from "../workflow/workflowConfig";

const getBadgeStyle = (status) => {
  const states = WORKFLOW_DEFINITIONS.STANDARD_RESEARCH_WORKFLOW.states;
  const variant = states[status]?.badgeVariant || "secondary";
  switch (variant) {
    case "success": return "bg-green-50 text-green-700 border-green-200";
    case "danger": return "bg-red-50 text-red-700 border-red-200";
    case "warning": return "bg-amber-50 text-amber-700 border-amber-200";
    case "info": return "bg-blue-50 text-blue-700 border-blue-200";
    case "purple": return "bg-purple-50 text-purple-700 border-purple-200";
    case "orange": return "bg-orange-50 text-orange-700 border-orange-200";
    default: return "bg-brand-gray-50 text-brand-gray-700 border-brand-gray-200";
  }
};

export const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submission, loading, error, handleTransition } = useSubmission(id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { allowedActions, stateLabel } = useWorkflowActions(submission, user);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gray-400" />
        <span className="text-xs text-brand-gray-400">Loading details...</span>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white border border-brand-gray-200 rounded-md shadow-sm space-y-4 my-12">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-brand-gray-900">Submission Not Found</h2>
        <p className="text-xs text-brand-gray-500">The requested claim is either invalid or you lack permissions to view it.</p>
        <Button onClick={() => navigate("/dashboard")} className="text-xs">Go to Dashboard</Button>
      </div>
    );
  }

  const metadataEntries = Object.entries(submission.metadata || {});

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 text-left">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-gray-100 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs text-brand-gray-400 hover:text-black font-semibold transition-colors mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Queue
          </button>
          <h1 className="text-xl font-bold text-brand-gray-900">{submission.title}</h1>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className="font-mono text-brand-gray-400 font-bold">{submission.id}</span>
            <span className="text-brand-gray-300">•</span>
            <span className="text-brand-gray-400 capitalize">{submission.typeId?.replace(/_/g, " ")}</span>
            <span className="text-brand-gray-300">•</span>
            <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getBadgeStyle(submission.status)}`}>
              {stateLabel}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {allowedActions.length > 0 && (
            <Button
              onClick={() => setDrawerOpen(true)}
              className="text-xs flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-brand-gray-800 text-white shadow-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              Evaluate & Process
            </Button>
          )}
          {submission.status === "RETURNED" && submission.creatorId === user.id && (
            <Button
              onClick={() => navigate(`/submissions/submit?type=${submission.typeId}&id=${submission.id}`)}
              className="text-xs flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-brand-gray-800 text-white"
            >
              Edit & Resubmit
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Metadata Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 border border-brand-gray-200/80 bg-white/50 backdrop-blur-sm shadow-sm space-y-4">
            <div className="border-b border-brand-gray-100 pb-3">
              <h3 className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-brand-gray-500" />
                Submitted Document Metadata
              </h3>
            </div>

            {metadataEntries.length === 0 ? (
              <p className="text-xs text-brand-gray-400 italic">No metadata values recorded.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metadataEntries.map(([key, val]) => {
                  if (typeof val === "object" && val !== null) return null; // Table or array logic below
                  return (
                    <div key={key} className="space-y-0.5 border-b border-brand-gray-50 pb-2">
                      <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <p className="text-sm font-semibold text-brand-gray-800">
                        {typeof val === "boolean" ? (val ? "Yes" : "No") : String(val)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Repeatable tables (e.g. coauthors list) */}
            {submission.metadata?.authors && (
              <div className="mt-4 pt-4 border-t border-brand-gray-100">
                <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider block mb-2">
                  Co-Authors / Contributors List
                </span>
                <div className="border border-brand-gray-200 rounded-md overflow-hidden bg-white shadow-sm text-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-brand-gray-50 border-b border-brand-gray-200 font-bold">
                        <th className="p-2">Faculty ID</th>
                        <th className="p-2">Order</th>
                        <th className="p-2">Corresponding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gray-100">
                      {submission.metadata.authors.map((auth, idx) => (
                        <tr key={idx} className="hover:bg-brand-gray-50/50">
                          <td className="p-2 font-semibold font-mono">{auth.faculty || "Internal"}</td>
                          <td className="p-2">{auth.authorOrder || idx + 1}</td>
                          <td className="p-2">{auth.isCorresponding ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right column - Lifecycle Timeline */}
        <div className="space-y-6">
          <Card className="p-5 border border-brand-gray-200/80 bg-white/50 backdrop-blur-sm shadow-sm">
            <SubmissionTimeline history={submission.approvalHistory} />
          </Card>

          {submission.paymentDetails && (
            <Card className="p-5 border border-green-200 bg-green-50/40 backdrop-blur-sm shadow-sm space-y-3">
              <div className="border-b border-green-100 pb-2">
                <h4 className="text-xs font-bold text-green-800 uppercase tracking-wider">Payment Released Info</h4>
              </div>
              <div className="text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-brand-gray-500 font-semibold">Transaction ID</span>
                  <span className="font-mono font-bold text-black">{submission.paymentDetails.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray-500 font-semibold">Amount Released</span>
                  <span className="font-bold text-green-700">₹{submission.incentiveAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray-500 font-semibold">Date Released</span>
                  <span>{new Date(submission.paymentDetails.dateReleased).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Evaluate drawer modal */}
      <ReviewDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        submission={submission}
        onTransition={handleTransition}
        user={user}
      />
    </div>
  );
};
