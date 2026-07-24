import React from "react";
import { CheckCircle2, User, Clock, MessageSquare, AlertCircle } from "lucide-react";

export const TimelineEvent = ({ event, isLast }) => {
  const getIcon = (action) => {
    switch (action) {
      case "SUBMIT_CLAIM":
      case "RESUBMIT":
        return <CheckCircle2 className="h-4 w-4 text-brand-blue-500" />;
      case "APPROVE":
      case "APPROVE_INCENTIVE":
      case "VERIFY_DATA":
      case "RELEASE_PAYMENT":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "RETURN":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "REJECT":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-brand-gray-400" />;
    }
  };

  return (
    <div className="flex gap-3 text-left">
      {/* Left Icon Timeline bar */}
      <div className="flex flex-col items-center">
        <div className="bg-white border border-brand-gray-200 rounded-full p-1 shadow-sm">
          {getIcon(event.action)}
        </div>
        {!isLast && <div className="w-[1.5px] bg-brand-gray-200 flex-1 my-1"></div>}
      </div>

      {/* Right details */}
      <div className="space-y-1 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-gray-800">{event.actionLabel || event.action}</span>
          <span className="text-[10px] bg-brand-gray-100 px-1.5 py-0.5 rounded-md text-brand-gray-500 uppercase font-mono">
            {event.toState}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-brand-gray-400 font-medium">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {event.actorName} ({event.actorRole})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(event.timestamp).toLocaleString()}
          </span>
        </div>

        {event.comment && (
          <div className="flex items-start gap-1.5 bg-brand-gray-50/50 border border-brand-gray-100 rounded p-2 text-xs text-brand-gray-600 mt-1 max-w-lg">
            <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brand-gray-400" />
            <span>{event.comment}</span>
          </div>
        )}
      </div>
    </div>
  );
};
