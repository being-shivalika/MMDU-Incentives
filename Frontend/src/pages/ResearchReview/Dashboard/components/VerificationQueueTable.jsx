import React from "react";
import { Eye } from "lucide-react";

const getStatusBadge = (status) => {
  switch (status) {
    case "pending_verification":
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending Verification</span>;
    case "verified":
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Verified</span>;
    case "returned":
      return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Returned</span>;
    case "rejected":
      return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>;
    case "forwarded_accounts":
      return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Forwarded to Accounts</span>;
    default:
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
  }
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case "High":
      return <span className="text-red-600 font-medium text-sm">High</span>;
    case "Medium":
      return <span className="text-yellow-600 font-medium text-sm">Medium</span>;
    case "Low":
      return <span className="text-green-600 font-medium text-sm">Low</span>;
    default:
      return <span className="text-gray-600 font-medium text-sm">{priority}</span>;
  }
};

const VerificationQueueTable = ({ data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Applicant</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row, idx) => (
            <tr 
              key={idx} 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onRowClick(row)}
            >
              <td className="px-4 py-4 font-medium text-gray-900">{row.id}</td>
              <td className="px-4 py-4">
                <p className="font-medium">{row.applicant.name}</p>
                <p className="text-xs text-gray-500">{row.applicant.type} - {row.applicant.id}</p>
              </td>
              <td className="px-4 py-4 text-gray-500">{row.department}</td>
              <td className="px-4 py-4">{row.type}</td>
              <td className="px-4 py-4">
                <p className="truncate max-w-[200px]" title={row.title}>{row.title}</p>
              </td>
              <td className="px-4 py-4 text-gray-500">{row.submittedDate}</td>
              <td className="px-4 py-4">{getPriorityBadge(row.priority)}</td>
              <td className="px-4 py-4">{getStatusBadge(row.status)}</td>
              <td className="px-4 py-4 text-right">
                <button 
                  className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick(row);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                No submissions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VerificationQueueTable;
