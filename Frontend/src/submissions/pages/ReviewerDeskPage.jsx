import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSubmissionQueue } from "../hooks/useSubmissionQueue";
import { DeskQueueTable } from "../components/desk/DeskQueueTable";
import { useAuth } from "../../../contexts/AuthContext";
import { ClipboardList, Inbox, History, ShieldAlert } from "lucide-react";

export const ReviewerDeskPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "inbox"; // inbox | archive

  // Calculate strict default filters based on active office desk
  const getDeskFilter = () => {
    const filters = {};
    if (user?.role === "hod") {
      filters.department = user.department;
      filters.status = tab === "inbox" ? "DEPARTMENT_REVIEW" : ["PRINCIPAL_REVIEW", "RPC_VERIFICATION", "ACCOUNTS_PROCESSING", "COMPLETED", "RETURNED", "REJECTED"];
    } else if (user?.role === "principal") {
      filters.status = tab === "inbox" ? "PRINCIPAL_REVIEW" : ["RPC_VERIFICATION", "ACCOUNTS_PROCESSING", "COMPLETED", "RETURNED", "REJECTED"];
    } else if (user?.role === "rpc") {
      filters.status = tab === "inbox" ? ["RPC_VERIFICATION"] : ["ACCOUNTS_PROCESSING", "COMPLETED", "RETURNED", "REJECTED"];
    } else if (user?.role === "accounts") {
      filters.status = tab === "inbox" ? "ACCOUNTS_PROCESSING" : ["COMPLETED"];
    }
    return filters;
  };

  const { submissions, loading } = useSubmissionQueue(getDeskFilter());

  const getOfficeTitle = () => {
    switch (user?.role) {
      case "hod": return "Department HOD Desk";
      case "principal": return "Office of the Principal (Executive)";
      case "rpc": return "Research Policy Committee Desk";
      case "accounts": return "Finance & Accounts Office";
      default: return "Officer Desk";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-gray-150 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-brand-gray-900 flex items-center gap-2">
            <ClipboardList className="h-5.5 w-5.5 text-brand-blue-500" />
            {getOfficeTitle()}
          </h1>
          <p className="text-xs text-brand-gray-400">
            Administrative queue of incentive claim files physically dispatched to your office desk.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-brand-gray-100 pb-2 text-xs font-bold uppercase tracking-wider">
        <a
          href={`?tab=inbox`}
          className={`flex items-center gap-1.5 pb-2 border-b-2 transition-all ${
            tab === "inbox" ? "border-black text-black" : "border-transparent text-brand-gray-400 hover:text-black"
          }`}
        >
          <Inbox className="h-4 w-4" />
          Active Inbox ({submissions.length})
        </a>
        <a
          href={`?tab=archive`}
          className={`flex items-center gap-1.5 pb-2 border-b-2 transition-all ${
            tab === "archive" ? "border-black text-black" : "border-transparent text-brand-gray-400 hover:text-black"
          }`}
        >
          <History className="h-4 w-4" />
          Outbox / Dispatched History
        </a>
      </div>

      {/* Queue View */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs text-brand-gray-400 font-semibold">
          <span>Desk Inbox Ledger</span>
          <span className="flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            Pending Action
          </span>
        </div>
        <DeskQueueTable submissions={submissions} loading={loading} />
      </div>
    </div>
  );
};
