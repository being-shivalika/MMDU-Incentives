import React from "react";
import Badge from "./Badge";
import Card from "./Card";

const SubmissionCard = ({ submission, onClick }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
        return "success";
      case "rejected":
        return "danger";
      case "under review":
      case "submitted":
        return "info";
      case "revision requested":
        return "warning";
      case "draft":
      default:
        return "neutral";
    }
  };

  return (
    <div onClick={() => onClick && onClick(submission)} className="cursor-pointer">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{submission.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{submission.submissionType} • {submission.category}</p>
            </div>
            <Badge variant={getStatusColor(submission.status)}>
              {submission.status || "Unknown"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <div>
              <span className="text-gray-500 block">Department</span>
              <span className="font-medium text-gray-800">{submission.department || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Domain</span>
              <span className="font-medium text-gray-800">{submission.domain || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Submission Date</span>
              <span className="font-medium text-gray-800">{submission.submissionDate ? new Date(submission.submissionDate).toLocaleDateString() : "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Last Updated</span>
              <span className="font-medium text-gray-800">{submission.lastUpdated ? new Date(submission.lastUpdated).toLocaleDateString() : "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Current Review Level</span>
              <span className="font-medium text-gray-800">{submission.currentReviewLevel || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Reviewing Authority</span>
              <span className="font-medium text-gray-800">{submission.reviewingAuthority || "-"}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubmissionCard;
