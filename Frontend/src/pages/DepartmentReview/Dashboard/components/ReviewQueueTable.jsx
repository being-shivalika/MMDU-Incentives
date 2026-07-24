import React from "react";
import dayjs from "dayjs";
import Badge from "../../../../components/Ui/Badge";
import { ChevronRight } from "lucide-react";

const ReviewQueueTable = ({ data, onRowClick }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "pending_review":
        return <Badge variant="warning">Pending Review</Badge>;
      case "returned":
        return <Badge variant="danger">Returned</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      case "forwarded":
        return <Badge variant="info">Forwarded</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 font-semibold text-gray-700">Submission ID</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Applicant</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Type</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Title</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Submitted Date</th>
            <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 font-semibold text-gray-700 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No submissions found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row)}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 font-medium">{row.id}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{row.applicant.name}</p>
                  <p className="text-xs text-gray-500">{row.applicant.department}</p>
                </td>
                <td className="px-6 py-4">{row.type}</td>
                <td className="px-6 py-4 max-w-xs truncate">{row.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayjs(row.submittedAt).format("MMM DD, YYYY")}
                </td>
                <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                <td className="px-6 py-4 text-center">
                  <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewQueueTable;
