import React from "react";
import { TimelineEvent } from "./TimelineEvent";
import { ClipboardList } from "lucide-react";

export const SubmissionTimeline = ({ history = [] }) => {
  if (history.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed border-brand-gray-200 rounded-md bg-white text-xs text-brand-gray-400">
        No workflow events recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2 border-b border-brand-gray-100 pb-2.5">
        <ClipboardList className="h-5 w-5 text-brand-gray-600" />
        <h3 className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider">Submission Lifecycle Timeline & Audit Log</h3>
      </div>
      <div className="pt-2">
        {history.map((event, idx) => (
          <TimelineEvent
            key={event.id || idx}
            event={event}
            isLast={idx === history.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
