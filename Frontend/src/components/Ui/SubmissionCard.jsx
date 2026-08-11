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
  const s = status.replace(/_/g, " ").toUpperCase();
  if (s.includes("PRINCIPAL") || s.includes("HOD") || s.includes("DEPARTMENT")) {
    return "PENDING R & D REVIEW";
  }
  return s;
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
  const quartile = metadata?.quartile || submission?.quartile || submission?.fields?.quartile;
  
  // Checking multiple possible backend field locations for Department
  const department = metadata?.department || applicant?.department || "Computer Science & Engineering";
  const domain = metadata?.domain || metadata?.researchArea || "General Research";

  const getQuartileBadgeStyle = (q) => {
    if (q === "Q1") return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (q === "Q2") return "bg-blue-100 text-blue-800 border-blue-300";
    if (q === "Q3") return "bg-amber-100 text-amber-800 border-amber-300";
    if (q === "Q4") return "bg-slate-100 text-slate-800 border-slate-300";
    return "bg-neutral-100 text-neutral-600 border-neutral-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString();
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getWorkflowProgress = (st) => {
    const s = String(st || "").toUpperCase();
    if (s.includes("DRAFT")) {
      return { percent: 20, label: "Draft Saved", color: "bg-amber-500", text: "text-amber-600", step: "Step 1 of 5" };
    }
    if (s.includes("DEPARTMENT") || s.includes("HOD") || s.includes("PRINCIPAL")) {
      return { percent: 40, label: "Dept Review", color: "bg-amber-500", text: "text-amber-600", step: "Step 2 of 5" };
    }
    if (s.includes("RPC") || s.includes("R & D") || s.includes("RD")) {
      return { percent: 60, label: "R & D Review", color: "bg-[#8C0404]", text: "text-[#8C0404]", step: "Step 3 of 5" };
    }
    if (s.includes("ACCOUNT") || s.includes("FINANCE")) {
      return { percent: 80, label: "Finance & Accounts", color: "bg-[#8C0404]", text: "text-[#8C0404]", step: "Step 4 of 5" };
    }
    if (s.includes("COMPLETED") || s.includes("APPROVED") || s.includes("RELEASED")) {
      return { percent: 100, label: "Approved & Paid", color: "bg-emerald-600", text: "text-emerald-700", step: "Step 5 of 5" };
    }
    if (s.includes("RETURN") || s.includes("REVISION")) {
      return { percent: 35, label: "Revision Requested", color: "bg-orange-500", text: "text-orange-600", step: "Action Required" };
    }
    if (s.includes("REJECT")) {
      return { percent: 100, label: "Rejected", color: "bg-rose-600", text: "text-rose-600", step: "Closed" };
    }
    return { percent: 40, label: "In Review", color: "bg-amber-500", text: "text-amber-600", step: "Step 2 of 5" };
  };

  const progress = getWorkflowProgress(status);

  return (
    <div
      onClick={() => onClick(submission)}
      className="group relative flex flex-col justify-between bg-white border border-neutral-200 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:border-neutral-800 hover:shadow-md text-left w-full overflow-hidden"
    >
      <div className="space-y-3">
        {/* TOP ROW: META + QUARTILE BADGE + STATUS BADGE */}
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

          <div className="flex items-center gap-1.5">
            {quartile && (
              <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded border ${getQuartileBadgeStyle(quartile)}`}>
                {quartile}
              </span>
            )}
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusStyle(status)}`}>
              {formatStatus(status)}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-base font-bold text-neutral-800 leading-snug line-clamp-2 group-hover:underline underline-offset-4 decoration-neutral-300">
          {title}
        </h3>

        {/* DYNAMIC PROGRESS BAR */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            <span>Workflow Progress</span>
            <span className={progress.text}>{progress.step}</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden border border-neutral-200/50">
            <div
              className={`${progress.color} h-full rounded-full transition-all duration-500`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-3 pt-1">
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
              Domain / Quartile
            </span>
            <span className="text-xs font-semibold text-neutral-800 truncate flex items-center gap-1">
              {domain}
              {quartile && <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-1 rounded">({quartile})</span>}
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