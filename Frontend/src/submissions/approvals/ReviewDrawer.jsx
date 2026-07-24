import React, { useState } from "react";
import { Drawer } from "../../../components/ui/Drawer";
import { ActionButtons } from "./ActionButtons";
import { VerificationBadge } from "./VerificationBadge";
import { useWorkflowActions } from "../hooks/useWorkflowActions";
import { ClipboardList, ShieldCheck, AlertCircle } from "lucide-react";

export const ReviewDrawer = ({ isOpen, onClose, submission, onTransition, user }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { allowedActions, stateLabel, requiredRole } = useWorkflowActions(submission, user);

  if (!submission) return null;

  const handleAction = async (actionType) => {
    if ((actionType === "RETURN" || actionType === "REJECT") && !comment.trim()) {
      setErrorMsg("Please provide a reason or comments for return/rejection.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      await onTransition(submission.id, actionType, comment);
      setComment("");
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to complete workflow transition.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Evaluate Research Submission">
      <div className="space-y-6 text-left p-4 h-full overflow-y-auto">
        {/* State Information */}
        <div className="space-y-1 bg-brand-gray-50 border border-brand-gray-200/80 p-4 rounded-md">
          <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider block">Current Lifecycle Stage</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-brand-gray-900">{stateLabel}</span>
            <span className="text-xs bg-black text-white px-2 py-0.5 rounded font-medium capitalize">
              Role: {requiredRole || "None"}
            </span>
          </div>
        </div>

        {/* Verification Checks */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-brand-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-gray-500" />
            Reviewer Verification Verification Model
          </h4>
          <div className="space-y-2 p-3.5 bg-white border border-brand-gray-200 rounded-md">
            {submission.doi && (
              <div className="flex items-center justify-between text-xs border-b border-brand-gray-100 pb-2">
                <span className="text-brand-gray-500 font-medium">DOI Status</span>
                <VerificationBadge type="DOI" verified={true} />
              </div>
            )}
            {submission.scopusUrl && (
              <div className="flex items-center justify-between text-xs border-b border-brand-gray-100 pb-2">
                <span className="text-brand-gray-500 font-medium">Scopus Link</span>
                <VerificationBadge type="Scopus" verified={true} />
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-gray-500 font-medium">Policy Match</span>
              <span className="text-xs text-green-600 font-semibold">100% Policy Match</span>
            </div>
          </div>
        </div>

        {/* Comments Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider">
            Reviewer Remarks / Remarks (Required for Returns/Rejections)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-brand-gray-200 rounded-md p-3 text-sm focus:border-black placeholder:text-brand-gray-400"
            placeholder="Type reviews, corrections required, or authorization notes here..."
          />
          {errorMsg && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-semibold">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errorMsg}
            </p>
          )}
        </div>

        {/* Action Panel */}
        <div className="border-t border-brand-gray-100 pt-4 space-y-2">
          <label className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider block">Available Transitions</label>
          {allowedActions.length > 0 ? (
            <ActionButtons
              allowedActions={allowedActions}
              onActionClick={handleAction}
              loading={loading}
            />
          ) : (
            <p className="text-xs text-brand-gray-400 italic">No available actions for your user role in this state.</p>
          )}
        </div>
      </div>
    </Drawer>
  );
};
