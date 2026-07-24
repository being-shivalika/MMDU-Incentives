import React from "react";
import { Link } from "react-router-dom";
import { Eye, FileText, Calendar, User } from "lucide-react";
import { getDeskStateConfig } from "../../config/workflowDesks";

export const DeskQueueTable = ({ submissions = [], loading }) => {
  const getBadgeStyle = (status) => {
    const config = getDeskStateConfig(status);
    switch (config.badgeVariant) {
      case "success": return "bg-green-50 text-green-700 border-green-200";
      case "danger": return "bg-red-50 text-red-700 border-red-200";
      case "warning": return "bg-amber-50 text-amber-700 border-amber-200";
      case "info": return "bg-blue-50 text-blue-700 border-blue-200";
      case "purple": return "bg-purple-50 text-purple-700 border-purple-200";
      case "orange": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-brand-gray-50 text-brand-gray-700 border-brand-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    return getDeskStateConfig(status).label || status;
  };

  if (loading) {
    return (
      <div className="space-y-2.5 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-brand-gray-100 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-brand-gray-200 rounded-md bg-white text-xs text-brand-gray-400">
        No claim files found in this desk's queue.
      </div>
    );
  }

  return (
    <div className="border border-brand-gray-250 rounded-md overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-gray-50 border-b border-brand-gray-200">
              <th className="p-3 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">File ID</th>
              <th className="p-3 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Claim Title</th>
              <th className="p-3 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Category</th>
              <th className="p-3 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Submitted By</th>
              <th className="p-3 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Current Location</th>
              <th className="p-3 text-xs font-bold text-brand-gray-500 uppercase tracking-wider">Date Logged</th>
              <th className="p-3 w-14"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-100">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-brand-gray-50/50 transition-colors">
                <td className="p-3 text-xs font-mono font-bold text-brand-gray-900">{sub.id}</td>
                <td className="p-3 text-left">
                  <div className="flex flex-col max-w-sm">
                    <span className="text-sm font-bold text-brand-gray-900 line-clamp-1">{sub.title}</span>
                    {sub.incentiveAmount > 0 && (
                      <span className="text-xs text-brand-gray-500 font-semibold mt-0.5">
                        Payout: ₹{sub.incentiveAmount}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-xs font-semibold capitalize text-brand-gray-600">
                  {sub.typeId?.replace(/_/g, " ")}
                </td>
                <td className="p-3 text-xs">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-brand-gray-800 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 shrink-0 text-brand-gray-400" />
                      {sub.creatorName}
                    </span>
                    <span className="text-[10px] text-brand-gray-400 font-semibold">{sub.creatorDept}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center border px-2 py-0.5 rounded text-[10px] font-bold ${getBadgeStyle(sub.status)}`}>
                    {getStatusLabel(sub.status)}
                  </span>
                </td>
                <td className="p-3 text-xs text-brand-gray-400 font-medium">
                  {sub.dateSubmitted ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {new Date(sub.dateSubmitted).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="italic text-brand-gray-300">Draft</span>
                  )}
                </td>
                <td className="p-3 text-center">
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
