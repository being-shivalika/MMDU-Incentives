import React from "react";
import { ChevronRight, Clock, FileText } from "lucide-react";

const formatString = (str) => {
  if (!str) return "";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getStatusStyle = (status, submission = {}) => {
  const s = String(status || "").toUpperCase();
  const ost = String(submission.originalStatus || "").toUpperCase();

  if (submission.isPaid || ost === "COMPLETED" || s.includes("DISBURSED")) {
    return "bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold";
  }
  if (submission.isAccountsApproved) {
    return "bg-blue-50 text-blue-800 border-blue-300 font-bold";
  }
  if (ost === "ACCOUNTS_PROCESSING" || s.includes("ACCOUNTS")) {
    return "bg-purple-50 text-purple-800 border-purple-200 font-bold";
  }
  if (ost === "RPC_VERIFICATION" || ost === "PRINCIPAL_REVIEW" || s.includes("RPC") || s.includes("R & D") || s.includes("RD")) {
    return "bg-amber-50 text-amber-800 border-amber-300 font-bold";
  }
  if (ost === "DEPARTMENT_REVIEW" || s.includes("HOD")) {
    return "bg-amber-50 text-amber-800 border-amber-200 font-bold";
  }
  if (ost === "RETURNED" || s.includes("RETURN") || s.includes("REVISION")) {
    return "bg-orange-50 text-orange-800 border-orange-200 font-bold";
  }
  if (ost === "REJECTED" || s.includes("REJECT")) {
    return "bg-red-50 text-red-800 border-red-200 font-bold";
  }
  return "bg-neutral-100 text-neutral-600 border-neutral-200";
};

const formatStatus = (status, submission = {}) => {
  const s = String(status || "").toUpperCase();
  const ost = String(submission.originalStatus || "").toUpperCase();

  if (submission.isPaid || ost === "COMPLETED" || s.includes("DISBURSED")) {
    return "APPROVED & DISBURSED";
  }
  if (submission.isAccountsApproved) {
    return "APPROVED (PENDING CREDIT)";
  }
  if (ost === "ACCOUNTS_PROCESSING" || s.includes("ACCOUNTS")) {
    return "PENDING ACCOUNTS REVIEW";
  }
  if (ost === "RPC_VERIFICATION" || ost === "PRINCIPAL_REVIEW" || s.includes("RPC") || s.includes("R & D") || s.includes("RD")) {
    return "PENDING R & D REVIEW";
  }
  if (ost === "DEPARTMENT_REVIEW" || s.includes("HOD")) {
    const dept = String(submission.department || submission.metadata?.department || "").toLowerCase();
    const isMca = dept.includes("mca") || dept.includes("computer applications");
    return isMca ? "PENDING PRINCIPAL REVIEW" : "PENDING HOD REVIEW";
  }
  if (ost === "RETURNED" || s.includes("RETURN") || s.includes("REVISION")) {
    return "REVISION REQUESTED";
  }
  if (ost === "REJECTED" || s.includes("REJECT")) {
    return "REJECTED";
  }
  if (ost === "DRAFT" || s.includes("DRAFT")) {
    return "DRAFT";
  }

  return s || "PENDING REVIEW";
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

  const getWorkflowProgress = (st, submission = {}) => {
    const s = String(st || "").toUpperCase();
    const ost = String(submission.originalStatus || "").toUpperCase();

    if (submission.isPaid || ost === "COMPLETED" || s.includes("DISBURSED")) {
      return { percent: 100, label: "Approved & Paid", color: "bg-emerald-600", text: "text-emerald-700", step: "Step 5 of 5" };
    }
    if (submission.isAccountsApproved) {
      return { percent: 90, label: "Approved (Pending Credit)", color: "bg-emerald-500", text: "text-emerald-600", step: "Step 4 of 5" };
    }
    if (ost === "ACCOUNTS_PROCESSING" || s.includes("ACCOUNTS")) {
      return { percent: 80, label: "Finance & Accounts", color: "bg-purple-600", text: "text-purple-700", step: "Step 4 of 5" };
    }
    if (ost === "RPC_VERIFICATION" || ost === "PRINCIPAL_REVIEW" || s.includes("RPC") || s.includes("R & D") || s.includes("RD")) {
      return { percent: 60, label: "R & D Review", color: "bg-[#8C0404]", text: "text-[#8C0404]", step: "Step 3 of 5" };
    }
    if (ost === "DEPARTMENT_REVIEW" || s.includes("HOD")) {
      const dept = String(submission.department || submission.metadata?.department || "").toLowerCase();
      const isMca = dept.includes("mca") || dept.includes("computer applications");
      const label = isMca ? "Principal Review" : "HOD Review";
      return { percent: 40, label, color: "bg-amber-500", text: "text-amber-600", step: "Step 2 of 5" };
    }
    if (ost === "RETURNED" || s.includes("RETURN") || s.includes("REVISION")) {
      return { percent: 35, label: "Revision Requested", color: "bg-orange-500", text: "text-orange-600", step: "Action Required" };
    }
    if (ost === "REJECTED" || s.includes("REJECT")) {
      return { percent: 100, label: "Rejected", color: "bg-rose-600", text: "text-rose-600", step: "Closed" };
    }
    if (ost === "DRAFT" || s.includes("DRAFT")) {
      return { percent: 20, label: "Draft Saved", color: "bg-amber-500", text: "text-amber-600", step: "Step 1 of 5" };
    }
    return { percent: 40, label: "In Review", color: "bg-amber-500", text: "text-amber-600", step: "Step 2 of 5" };
  };

  const progress = getWorkflowProgress(status, submission);

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
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusStyle(status, submission)}`}>
              {formatStatus(status, submission)}
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