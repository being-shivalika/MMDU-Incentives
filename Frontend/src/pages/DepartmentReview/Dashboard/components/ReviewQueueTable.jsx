import React from "react";
import dayjs from "dayjs";
import Badge from "../../../../components/Ui/Badge";
import { ChevronRight } from "lucide-react";

const ReviewQueueTable = ({ data = [], onRowClick }) => {
  const getStatusBadge = (status) => {
    if (!status) {
      return <Badge variant="default">Unknown</Badge>;
    }

    if (status === "Approved") {
      return <Badge variant="success">Approved</Badge>;
    }

    if (status === "Rejected") {
      return <Badge variant="danger">Rejected</Badge>;
    }

    if (status === "Revision Requested") {
      return <Badge variant="danger">Revision Requested</Badge>;
    }

    if (status.includes("Pending")) {
      return <Badge variant="warning">{status}</Badge>;
    }

    return <Badge variant="default">{status}</Badge>;
  };

  const getCurrentLevelBadge = (level) => {
    if (!level) return "-";

    return (
      <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
        {level}
      </span>
    );
  };

  if (!data.length) {
    return (
      <div className="py-12 text-center text-gray-500">
        No submissions available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Submission
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Applicant
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Category
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Current Stage
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Submitted
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
              Status
            </th>

            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              Review
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((submission) => (
            <tr
              key={submission.id}
              onClick={() => onRowClick(submission)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <p className="font-semibold text-gray-900">
                  {submission.claimNumber || submission.id}
                </p>

                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {submission.title}
                </p>
              </td>

              <td className="px-6 py-4">
                <p className="font-medium">
                  {submission.submittedBy ||
                    submission.creatorName ||
                    "Unknown Applicant"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {submission.creatorDept || submission.department || "Unknown"}
                </p>
              </td>

              <td className="px-6 py-4">
                <p className="font-medium">{submission.category}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {submission.subtype}
                </p>
              </td>

              <td className="px-6 py-4">
                {getCurrentLevelBadge(submission.currentLevel)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {dayjs(submission.dateSubmitted || submission.createdAt).format(
                  "DD MMM YYYY",
                )}
              </td>

              <td className="px-6 py-4">{getStatusBadge(submission.status)}</td>

              <td className="px-6 py-4 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick(submission);
                  }}
                  className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewQueueTable;
