import React from "react";
import { ChevronRight, Clock, FileText } from "lucide-react";

const formatString = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getStatusStyle = (status) => {
  const safeStatus = status?.toUpperCase() || "";
  if (safeStatus.includes("DRAFT")) {
    return "bg-neutral-100 text-neutral-600 border-neutral-200";
  }
  if (safeStatus.includes("REVIEW") || safeStatus.includes("PENDING")) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  if (safeStatus.includes("APPROVED") || safeStatus.includes("VERIFIED")) {
    return "bg-green-50 text-green-700 border-green-200";
  }
  if (safeStatus.includes("REJECTED")) {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-neutral-100 text-neutral-600 border-neutral-200";
};

const formatStatus = (status) => {
  if (!status) return "UNKNOWN";
  return status.replace(/_/g, " ").toUpperCase();
};

const SubmissionCard = ({ submission, onClick }) => {
  const { 
    metadata = {}, 
    status, 
    category, 
    subtype, 
    updatedAt, 
    createdAt,
    applicant 
  } = submission || {};

  const title = metadata?.title || submission?.title || "Untitled Submission";
  
  // Checking multiple possible backend field locations for Department
  const department = metadata?.department || applicant?.department || "Computer Science & Engineering";
  const domain = metadata?.domain || metadata?.researchArea || "General Research";

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div
      onClick={() => onClick(submission)}
      className="group relative flex flex-col justify-between bg-white border border-neutral-200 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-neutral-800 hover:shadow-md text-left w-full overflow-hidden"
    >
      <div className="space-y-3">
        {/* TOP ROW: META + STATUS BADGE (NO OVERFLOW) */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <FileText className="h-3.5 w-3.5 text-neutral-400" />
            <span>{formatString(category)}</span>
            {subtype && (
              <>
                <span className="text-neutral-300">•</span>
                <span>{formatString(subtype)}</span>
              </>
            )}
          </div>

          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusStyle(status)}`}>
            {formatStatus(status)}
          </span>
        </div>

        {/* TITLE */}
        <h3 className="text-base font-bold text-neutral-800 leading-snug line-clamp-2 group-hover:underline underline-offset-4 decoration-neutral-300">
          {title}
        </h3>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Department
            </span>
            <span className="text-xs font-semibold text-neutral-800 truncate">
              {department}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Domain
            </span>
            <span className="text-xs font-semibold text-neutral-800 truncate">
              {domain}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <Clock className="h-3.5 w-3.5" />
          <span>Updated {formatDate(updatedAt || createdAt)}</span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider group-hover:text-neutral-800 transition-colors">
          <span>View</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;