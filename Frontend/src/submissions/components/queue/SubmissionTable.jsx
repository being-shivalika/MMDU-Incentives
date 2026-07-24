import React from "react";
import { Link } from "react-router-dom";
import { Eye, ExternalLink, Calendar, User } from "lucide-react";
import { WORKFLOW_DEFINITIONS } from "../../workflow/workflowConfig";

const getBadgeStyle = (status) => {
  const states = WORKFLOW_DEFINITIONS.STANDARD_RESEARCH_WORKFLOW.states;
  const stateDef = states[status];
  const variant = stateDef?.badgeVariant || "secondary";

  switch (variant) {
    case "success":
      return "bg-green-50 text-green-700 border-green-200";
    case "danger":
      return "bg-red-50 text-red-700 border-red-200";
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "info":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "purple":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "orange":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-brand-gray-50 text-brand-gray-700 border-brand-gray-200";
  }
};

const getStatusLabel = (status) => {
  const states = WORKFLOW_DEFINITIONS.STANDARD_RESEARCH_WORKFLOW.states;
  return states[status]?.label || status;
};

export const SubmissionTable = ({ submissions = [], loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-16 w-full bg-brand-gray-100 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-brand-gray-200 rounded-md bg-white text-sm text-brand-gray-400">
        No submissions match the current selection.
      </div>
    );
  }

  return (
    <div className="border border-brand-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-gray-50 border-b border-brand-gray-200">
              <th className="p-3.5 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Submission ID</th>
              <th className="p-3.5 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Title / Claim Details</th>
              <th className="p-3.5 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-3.5 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Author</th>
              <th className="p-3.5 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Lifecycle Stage</th>
              <th className="p-3.5 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Date</th>
              <th className="p-3.5 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-100">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-brand-gray-50/50 transition-colors">
                <td className="p-3.5 text-xs font-mono font-bold text-brand-gray-900">{sub.id}</td>
                <td className="p-3.5">
                  <div className="flex flex-col text-left max-w-md">
                    <span className="text-sm font-bold text-brand-gray-900 line-clamp-1">{sub.title}</span>
                    {sub.incentiveAmount > 0 && (
                      <span className="text-xs text-brand-gray-500 font-semibold mt-0.5">
                        Incentive: ₹{sub.incentiveAmount}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3.5 text-xs font-semibold capitalize text-brand-gray-600">
                  {sub.typeId?.replace(/_/g, " ") || "Research"}
                </td>
                <td className="p-3.5 text-xs">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-brand-gray-800 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 shrink-0 text-brand-gray-400" />
                      {sub.creatorName}
                    </span>
                    <span className="text-[10px] text-brand-gray-400 font-semibold">{sub.creatorDept}</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className={`inline-flex items-center border px-2 py-0.5 rounded text-xs font-bold capitalize ${getBadgeStyle(sub.status)}`}>
                    {getStatusLabel(sub.status)}
                  </span>
                </td>
                <td className="p-3.5 text-xs text-brand-gray-400 font-medium">
                  {sub.dateSubmitted ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {new Date(sub.dateSubmitted).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="italic text-brand-gray-300">Not submitted</span>
                  )}
                </td>
                <td className="p-3.5 text-center">
                  <Link
                    to={`/submissions/detail/${sub.id}`}
                    className="inline-flex items-center justify-center p-1.5 border border-brand-gray-200 rounded-md bg-white hover:bg-black hover:text-white transition-all text-brand-gray-600 shadow-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
