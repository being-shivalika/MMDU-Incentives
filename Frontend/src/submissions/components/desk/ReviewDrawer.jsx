import React, { useState } from "react";
import { Drawer } from "../../../../components/ui/Drawer";
import { getDeskStateConfig, DESK_STATES } from "../../config/workflowDesks";
import { Button } from "../../../../components/ui/Button";
import { Check, X, RotateCcw, Send, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export const ReviewDrawer = ({ isOpen, onClose, submission, onTransition, user }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!submission || !user) return null;

  const currentStatus = submission.status || DESK_STATES.DRAFT;
  const deskConfig = getDeskStateConfig(currentStatus);
  const isAssignedRole = deskConfig.requiredRole === user.role;
  const allowedActions = isAssignedRole ? (deskConfig.allowedActions || []) : [];

  const handleAction = async (actionType) => {
    // Remarks are mandatory for Returns or Rejections
    const isReturnOrReject = ["RETURN_TO_FACULTY", "REJECT_PERMANENTLY", "RETURN_TO_PRINCIPAL", "REJECT_TO_PRINCIPAL"].includes(actionType);
    if (isReturnOrReject && !comment.trim()) {
      setErrorMsg("Please specify remarks / correction details for this action.");
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      await onTransition(submission.id, actionType, comment);
      setComment("");
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to process desk action.");
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (type) => {
    if (type.includes("FORWARD") || type.includes("APPROVE")) return <Check className="h-4 w-4" />;
    if (type.includes("RETURN")) return <RotateCcw className="h-4 w-4" />;
    if (type.includes("REJECT")) return <X className="h-4 w-4" />;
    return <Send className="h-4 w-4" />;
  };

  // Find verification urls from submission metadata
  const metadata = submission.metadata || {};
  const verificationLinks = Object.entries(metadata)
    .filter(([key, val]) => typeof val === "string" && (val.startsWith("http://") || val.startsWith("https://")))
    .map(([key, val]) => ({ key, val }));

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Administrative Officer Action Sheet">
      <div className="space-y-6 text-left p-4 h-full overflow-y-auto">
        {/* Status Sheet Info */}
        <div className="space-y-1 bg-brand-gray-50 border border-brand-gray-250 p-4 rounded-md">
          <span className="text-[9px] text-brand-gray-400 font-bold uppercase tracking-wider block">Office Location</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-brand-gray-900">{deskConfig.label}</span>
            <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">
              Desk Owner: {deskConfig.requiredRole || "N/A"}
            </span>
          </div>
        </div>

        {/* Verification Check panel */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-brand-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-gray-500" />
            Verification Model & Link Audits
          </h4>
          <div className="space-y-2 p-3.5 bg-white border border-brand-gray-200 rounded-md">
            {verificationLinks.length === 0 ? (
              <span className="text-xs text-brand-gray-400 italic">No external verification links found in this file.</span>
            ) : (
              verificationLinks.map((link) => (
                <div key={link.key} className="flex items-center justify-between text-xs border-b border-brand-gray-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-brand-gray-500 font-semibold capitalize">{link.key.replace(/([A-Z])/g, " $1")}</span>
                  <a
                    href={link.val}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-blue-500 hover:text-black font-bold flex items-center gap-0.5"
                  >
                    Open Link
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Remarks Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider block">
            Administrative Officer Remarks / Comments
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-brand-gray-200 rounded-md p-3 text-sm focus:border-black placeholder:text-brand-gray-400"
            placeholder="Specify return reasons, policy citation numbers, or disbursement authorizations here..."
          />
          {errorMsg && (
            <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {errorMsg}
            </p>
          )}
        </div>

        {/* Action Dispatcher buttons */}
        <div className="border-t border-brand-gray-100 pt-4 space-y-3">
          <label className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider block">
            Authorized Desks Dispatch Actions
          </label>
          {allowedActions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allowedActions.map((act) => (
                <Button
                  key={act.type}
                  type="button"
                  onClick={() => handleAction(act.type)}
                  disabled={loading}
                  variant={act.variant || "outline"}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2"
                >
                  {getActionIcon(act.type)}
                  {act.label}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-brand-gray-400 italic">
              No actions available. This file is currently waiting on the <strong>{deskConfig.label}</strong>.
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
};
