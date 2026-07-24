import React from "react";
import { Button } from "../../../components/ui/Button";
import { Check, X, RotateCcw, Send, AlertTriangle, CreditCard } from "lucide-react";

const getIcon = (actionType) => {
  switch (actionType) {
    case "APPROVE":
    case "APPROVE_INCENTIVE":
    case "VERIFY_DATA":
      return <Check className="h-4 w-4 shrink-0" />;
    case "REJECT":
      return <X className="h-4 w-4 shrink-0" />;
    case "RETURN":
      return <RotateCcw className="h-4 w-4 shrink-0" />;
    case "SUBMIT_CLAIM":
    case "RESUBMIT":
      return <Send className="h-4 w-4 shrink-0" />;
    case "RELEASE_PAYMENT":
      return <CreditCard className="h-4 w-4 shrink-0" />;
    default:
      return <AlertTriangle className="h-4 w-4 shrink-0" />;
  }
};

export const ActionButtons = ({ allowedActions = [], onActionClick, loading }) => {
  if (allowedActions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {allowedActions.map((act) => (
        <Button
          key={act.type}
          type="button"
          onClick={() => onActionClick(act.type)}
          disabled={loading}
          variant={act.variant || "outline"}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider"
        >
          {getIcon(act.type)}
          {act.label}
        </Button>
      ))}
    </div>
  );
};
