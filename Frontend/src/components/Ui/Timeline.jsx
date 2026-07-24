import React from "react";
import { Check, Clock, AlertCircle, RefreshCw, XCircle } from "lucide-react";
import { cn } from "../../utils/cn";
import dayjs from "dayjs";

export default function Timeline({ history = [], className }) {
  const getIcon = (status) => {
    switch (status) {
      case "approved":
      case "completed":
        return <Check className="h-4.5 w-4.5 text-emerald-600" />;
      case "returned":
        return <RefreshCw className="h-4 w-4 text-amber-600" />;
      case "rejected":
        return <XCircle className="h-4.5 w-4.5 text-rose-600" />;
      default:
        return <Clock className="h-4 w-4 text-brand-gray-500" />;
    }
  };

  const getIconBg = (status) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-emerald-50 border-emerald-200";
      case "returned":
        return "bg-amber-50 border-amber-200";
      case "rejected":
        return "bg-rose-50 border-rose-200";
      default:
        return "bg-brand-gray-50 border-brand-gray-200";
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="text-sm text-brand-gray-400 py-2">
        No timeline records found.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative pl-6 border-l border-brand-gray-200 space-y-6 ml-3 py-2",
        className,
      )}
    >
      {history.map((item, idx) => (
        <div key={idx} className="relative">
          {/* Timeline Dot Indicator */}
          <div
            className={cn(
              "absolute -left-[37px] top-0.5 rounded-full border h-8 w-8 flex items-center justify-center bg-white shadow-sm",
              getIconBg(item.status),
            )}
          >
            {getIcon(item.status)}
          </div>

          {/* Timeline content details */}
          <div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-brand-gray-900 text-sm">
                {item.step}
              </span>
              <span className="text-xs text-brand-gray-400">
                {item.date
                  ? dayjs(item.date).format("MMM DD, YYYY hh:mm A")
                  : "Pending"}
              </span>
            </div>

            <p className="text-xs text-brand-gray-500 mt-0.5">
              By{" "}
              <span className="font-medium text-brand-gray-700">
                {item.actionByName}
              </span>
            </p>

            {item.remarks && (
              <div className="mt-2 text-xs bg-brand-gray-50 text-brand-gray-600 p-2.5 rounded border border-brand-gray-100 italic">
                "{item.remarks}"
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
