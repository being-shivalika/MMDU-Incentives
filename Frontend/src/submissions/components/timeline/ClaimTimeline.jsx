import React from "react";
import { Clock, User, MessageCircle, FileText } from "lucide-react";

export const ClaimTimeline = ({ history = [] }) => {
  if (history.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed border-brand-gray-200 rounded-md bg-white text-xs text-brand-gray-400">
        No administrative history recorded.
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2 border-b border-brand-gray-150 pb-2">
        <FileText className="h-4.5 w-4.5 text-brand-gray-500" />
        <h4 className="text-xs font-bold text-brand-gray-700 uppercase tracking-wider">
          Official File Audit Trail & Activity Log
        </h4>
      </div>

      <div className="relative pl-4 space-y-5 border-l border-brand-gray-200 ml-2">
        {history.map((evt, idx) => (
          <div key={evt.id || idx} className="relative space-y-1 animate-in fade-in duration-200">
            {/* Timeline node icon indicator */}
            <span className="absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-white border-2 border-black"></span>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-brand-gray-900">{evt.actionLabel || evt.action}</span>
              <span className="text-[9px] bg-brand-gray-100 px-1.5 py-0.2 rounded font-mono font-bold uppercase text-brand-gray-500">
                ➔ {evt.toState}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[9px] text-brand-gray-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-0.5">
                <User className="h-3 w-3" />
                {evt.actorName} ({evt.actorRole})
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {new Date(evt.timestamp).toLocaleString()}
              </span>
            </div>

            {evt.comment && (
              <div className="flex items-start gap-1 bg-brand-gray-50 border border-brand-gray-150 rounded p-2 text-xs text-brand-gray-600 max-w-xl mt-1 leading-relaxed">
                <MessageCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brand-gray-400" />
                <span>{evt.comment}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
