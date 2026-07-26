import React from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { FileClock, Edit2, Trash2 } from "lucide-react";

const mockDrafts = [
  {
    id: "DRF-1029",
    type: "Patent",
    title: "AI Framework for Early Disease Detection",
    lastSaved: "2 Hours Ago",
    completion: 65,
  },
  {
    id: "DRF-1084",
    type: "Publication",
    title: "Quantum Computing Algorithms - A Review",
    lastSaved: "1 Day Ago",
    completion: 90,
  },
  {
    id: "DRF-1102",
    type: "Book Chapter",
    title: "Advanced Data Structures in C++",
    lastSaved: "3 Days Ago",
    completion: 30,
  },
];

const ApplicantDrafts = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Drafts"
        subtitle="Resume your incomplete research submissions."
        icon={FileClock}
      />

      {mockDrafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDrafts.map((draft) => (
            <div key={draft.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {draft.type}
                </span>
                <span className="text-xs text-gray-400">ID: {draft.id}</span>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-4 line-clamp-2 min-h-[3rem]">
                {draft.title || "Untitled Submission"}
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Completion</span>
                  <span>{draft.completion}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${draft.completion}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                <span className="text-xs text-gray-400">Saved: {draft.lastSaved}</span>
                <div className="flex gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Draft">
                    <Trash2 size={16} />
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded hover:bg-indigo-100 transition-colors">
                    <Edit2 size={14} />
                    Resume
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <FileClock size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts found</h3>
          <p className="text-gray-500">You don't have any incomplete submissions at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicantDrafts;
