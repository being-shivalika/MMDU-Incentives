import React, { useState } from "react";
import { X, Check, ArrowRight, CornerUpLeft } from "lucide-react";
import Badge from "../../../../components/Ui/Badge";
import ActionButton from "../../../../shared/components/ActionButton";

const ReviewDrawer = ({ submission, isOpen, onClose, onAction }) => {
  const [remarks, setRemarks] = useState("");

  if (!isOpen || !submission) return null;

  const handleActionClick = (actionType) => {
    onAction(actionType, remarks);
    setRemarks(""); // Reset remarks
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Review Submission</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Applicant Details</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 border">
              <p className="font-medium text-lg">{submission.submittedBy || "Unknown Applicant"}</p>
              <p className="text-sm text-gray-600">Department: {submission.department || "Unknown"}</p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Research Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Submission ID</p>
                <p className="font-medium">{submission.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium text-gray-900">{submission.title}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{submission.submissionType || submission.type}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <p className="font-medium">{dayjs(submission.submittedAt).format("DD MMM YYYY")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg border">
                  {submission.generalInfo?.description || "No description provided."}
                </p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Reviewer Remarks (Optional)</p>
                <textarea 
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  placeholder="Enter remarks for this action..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3 flex-wrap">
          <ActionButton 
            defaultText="Approve" 
            activeText="Approved" 
            onClick={() => handleActionClick("Approve")}
            icon={Check}
            className="flex-1 bg-black text-white hover:bg-gray-800"
          />
          <ActionButton 
            defaultText="Request Revision" 
            activeText="Revision Requested" 
            onClick={() => handleActionClick("Request Revision")}
            icon={CornerUpLeft}
            variant="warning"
            className="flex-1"
          />
          <ActionButton 
            defaultText="Reject" 
            activeText="Rejected" 
            onClick={() => handleActionClick("Reject")}
            icon={X}
            variant="danger"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewDrawer;
