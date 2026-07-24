import React from "react";
import { X, Check, ArrowRight, CornerUpLeft } from "lucide-react";
import dayjs from "dayjs";
import Badge from "../../../../components/Ui/Badge";

const ReviewDrawer = ({ submission, isOpen, onClose, onAction }) => {
  if (!isOpen || !submission) return null;

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
              <p className="font-medium text-lg">{submission.applicant.name}</p>
              <p className="text-sm text-gray-600">{submission.applicant.designation}</p>
              <p className="text-sm text-gray-600">{submission.applicant.department}</p>
              <p className="text-sm text-gray-600">{submission.applicant.email}</p>
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
                  <p className="font-medium">{submission.type}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <p className="font-medium">{dayjs(submission.submittedAt).format("DD MMM YYYY")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg border">{submission.description}</p>
              </div>
              {submission.comments && (
                <div>
                  <p className="text-sm text-gray-500">Previous Comments</p>
                  <p className="text-sm mt-1 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{submission.comments}</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Attached Documents</h3>
            <div className="space-y-2">
              {submission.files.map((file, idx) => (
                <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium text-blue-600">{file.name}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3 flex-wrap">
          <button onClick={() => onAction("Approve")} className="flex-1 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <Check className="h-4 w-4" /> Approve
          </button>
          <button onClick={() => onAction("Forward")} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <ArrowRight className="h-4 w-4" /> Forward
          </button>
          <button onClick={() => onAction("Return")} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
            <CornerUpLeft className="h-4 w-4" /> Return
          </button>
          <button onClick={() => onAction("Reject")} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <X className="h-4 w-4" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDrawer;
