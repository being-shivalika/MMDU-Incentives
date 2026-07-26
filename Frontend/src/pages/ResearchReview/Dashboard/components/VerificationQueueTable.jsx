import React from "react";
import dayjs from "dayjs";
import ActionButton from "../../../../shared/components/ActionButton";
import Badge from "../../../../components/Ui/Badge";
import { ChevronRight, ExternalLink } from "lucide-react";

const VerificationQueueTable = ({ data, onRowClick }) => {
  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="default">Unknown</Badge>;
    
    if (status === "Approved") {
      return <Badge variant="success">Approved</Badge>;
    }
    if (status.includes("Pending") || status.includes("Review")) {
      return <Badge variant="warning">{status}</Badge>;
    }
    if (status === "Revision Requested" || status === "Returned") {
      return <Badge variant="danger">Revision Requested</Badge>;
    }
    if (status === "Rejected") {
      return <Badge variant="danger">Rejected</Badge>;
    }
    return <Badge variant="default">{status}</Badge>;
  };

  const getPriorityBadge = (quartile, status) => {
    if (status === "Approved") return <Badge variant="default">Normal</Badge>;
    if (quartile === "Q1") return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">High</span>;
    if (quartile === "Q2") return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Medium</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Normal</span>;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm text-left border-collapse bg-white">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-600">
            <th className="px-4 py-3 font-semibold">Submission ID</th>
            <th className="px-4 py-3 font-semibold">Faculty Info</th>
            <th className="px-4 py-3 font-semibold">Research Details</th>
            <th className="px-4 py-3 font-semibold">Metrics (Q / IF)</th>
            <th className="px-4 py-3 font-semibold">Dates & Status</th>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick(row)}
              className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
            >
              <td className="px-4 py-4 whitespace-nowrap font-medium text-blue-600">
                {row.id}
              </td>
              <td className="px-4 py-4 min-w-[200px]">
                <p className="font-semibold text-gray-900">{row.submittedBy || row.creatorName || "Unknown Applicant"}</p>
                <p className="text-xs text-gray-500 mt-0.5">{row.department || row.creatorDept || "Unknown Dept"}</p>
              </td>
              <td className="px-4 py-4 min-w-[250px] max-w-xs">
                <p className="font-medium text-gray-800 line-clamp-1">{row.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                    {row.submissionType || row.type || "N/A"}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {row.fields?.journalName || row.metadata?.journalName || "No Journal"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-900">{row.metadata?.quartile || row.fields?.quartile || "-"}</span>
                  <span className="text-xs text-gray-500">IF: {row.metadata?.impactFactor || row.fields?.impactFactor || "-"}</span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <p className="text-xs text-gray-500 mb-1">{dayjs(row.submittedAt || row.dateSubmitted).format("DD MMM YYYY")}</p>
                {getStatusBadge(row.status)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {getPriorityBadge(row.metadata?.quartile || row.fields?.quartile, row.status)}
              </td>
              <td className="px-4 py-4 text-center whitespace-nowrap">
                <button className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                  <span className="sr-only">View Details</span>
                  Review <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerificationQueueTable;
