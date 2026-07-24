import React from "react";
import { MessageSquare } from "lucide-react";

const VerificationComments = ({ comments = [] }) => {
  if (comments.length === 0) {
    return <p className="text-sm text-gray-500 italic">No previous comments.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, idx) => (
        <div key={idx} className="bg-gray-50 p-3 rounded-lg border">
          <div className="flex items-start gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-900">{comment.by}</span>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerificationComments;
