import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const getStatusIcon = (status) => {
  if (status === "submitted" || status === "hod_approved" || status === "verified" || status === "forwarded_accounts") {
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  }
  if (status === "returned" || status === "rejected") {
    return <Circle className="h-5 w-5 text-red-500" />;
  }
  return <Clock className="h-5 w-5 text-gray-400" />;
};

const getStatusLabel = (status) => {
  switch (status) {
    case "submitted": return "Application Submitted";
    case "hod_approved": return "Department HOD Approved";
    case "verified": return "Institution Verified";
    case "returned": return "Returned for Revision";
    case "rejected": return "Application Rejected";
    case "forwarded_accounts": return "Forwarded to Accounts";
    default: return status;
  }
};

const VerificationTimeline = ({ timeline = [] }) => {
  return (
    <div className="relative border-l border-gray-200 ml-3 space-y-6">
      {timeline.map((event, idx) => (
        <div key={idx} className="relative pl-6">
          <span className="absolute -left-2.5 top-1 bg-white">
            {getStatusIcon(event.status)}
          </span>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-gray-900">{getStatusLabel(event.status)}</h4>
            <p className="text-xs text-gray-500">{event.date} • by {event.by}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerificationTimeline;
