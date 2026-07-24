import React, { useState } from "react";
import { useSubmissionQueue } from "../hooks/useSubmissionQueue";
import { DeskQueueTable } from "../components/desk/DeskQueueTable";
import { useAuth } from "../../../contexts/AuthContext";
import { Card } from "../../../components/ui/Card";
import { ClipboardList, Plus, FileText, Send, Hourglass, ShieldCheck, CheckCircle2, RotateCcw, XCircle, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FacultyLedgerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedStage, setSelectedStage] = useState("ALL");

  const { submissions, loading } = useSubmissionQueue({ creatorId: user?.id });

  // Group submissions by stage
  const drafts = submissions.filter((s) => s.status === "DRAFT");
  const submitted = submissions.filter((s) => s.status === "SUBMITTED");
  const hodReview = submissions.filter((s) => s.status === "DEPARTMENT_REVIEW");
  const principalReview = submissions.filter((s) => s.status === "PRINCIPAL_REVIEW");
  const rpcVerification = submissions.filter((s) => s.status === "RPC_VERIFICATION");
  const accounts = submissions.filter((s) => s.status === "ACCOUNTS_PROCESSING");
  const completed = submissions.filter((s) => s.status === "COMPLETED");
  const returned = submissions.filter((s) => s.status === "RETURNED");
  const rejected = submissions.filter((s) => s.status === "REJECTED");

  const stages = [
    { id: "ALL", label: "All Claims", count: submissions.length, icon: ClipboardList, color: "text-brand-gray-500" },
    { id: "DRAFT", label: "Drafts", count: drafts.length, icon: FileText, color: "text-brand-gray-400" },
    { id: "DEPARTMENT_REVIEW", label: "HOD Desk", count: hodReview.length, icon: Hourglass, color: "text-amber-500" },
    { id: "PRINCIPAL_REVIEW", label: "Principal Desk", count: principalReview.length, icon: Hourglass, color: "text-purple-500" },
    { id: "RPC_VERIFICATION", label: "RPC Verification", count: rpcVerification.length, icon: ShieldCheck, color: "text-blue-500" },
    { id: "ACCOUNTS_PROCESSING", label: "Accounts", count: accounts.length, icon: ShieldCheck, color: "text-amber-600" },
    { id: "COMPLETED", label: "Completed", count: completed.length, icon: CheckCircle2, color: "text-green-500" },
    { id: "RETURNED", label: "Returned", count: returned.length, icon: RotateCcw, color: "text-orange-500" },
    { id: "REJECTED", label: "Rejected", count: rejected.length, icon: XCircle, color: "text-red-500" }
  ];

  const getFilteredSubmissions = () => {
    if (selectedStage === "ALL") return submissions;
    return submissions.filter((s) => s.status === selectedStage);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-gray-150 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-brand-gray-900 flex items-center gap-2">
            <ClipboardList className="h-5.5 w-5.5 text-brand-blue-500" />
            My Research Incentives Ledger
          </h1>
          <p className="text-xs text-brand-gray-400">
            Track the location and status of your claim files moving across university evaluation desks.
          </p>
        </div>
        <button
          onClick={() => navigate("/submissions/submit")}
          className="bg-black hover:bg-brand-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-md flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Submit New Claim File
        </button>
      </div>

      {/* Numerical stage stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isSelected = selectedStage === stage.id;
          return (
            <Card
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`p-3.5 border text-center cursor-pointer transition-all flex flex-col justify-between items-center ${
                isSelected ? "border-black bg-brand-gray-50/50 shadow-sm" : "border-brand-gray-200 bg-white hover:bg-brand-gray-50/20"
              }`}
            >
              <Icon className={`h-5 w-5 ${stage.color}`} />
              <div className="mt-2.5">
                <span className="text-[10px] font-bold text-brand-gray-400 block truncate max-w-full uppercase">
                  {stage.label}
                </span>
                <span className="text-lg font-extrabold text-brand-gray-900 leading-tight block mt-0.5">
                  {stage.count}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desk Queue table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-brand-gray-700 uppercase tracking-wider">
          Desk view: {stages.find((s) => s.id === selectedStage)?.label}
        </h3>
        <DeskQueueTable submissions={getFilteredSubmissions()} loading={loading} />
      </div>
    </div>
  );
};
