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
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-left">
      <PageHeader
        title="My Drafts"
        subtitle="Resume your incomplete research submissions."
        icon={FileClock}
      />

      {mockDrafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDrafts.map((draft) => (
            <div 
              key={draft.id} 
              className="group relative flex flex-col justify-between bg-white border border-neutral-200 rounded-xl p-5 shadow-sm transition-all duration-200 hover:border-neutral-800 hover:shadow-md"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {draft.type}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    ID: {draft.id}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-neutral-800 mb-4 line-clamp-2 min-h-[2.5rem] leading-snug">
                  {draft.title || "Untitled Submission"}
                </h3>
              </div>
              
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    <span>Completion</span>
                    <span>{draft.completion}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-neutral-800 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${draft.completion}%` }}
                    />
                  </div>
                </div>
                
                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Saved: {draft.lastSaved}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                      title="Delete Draft"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer">
                      <Edit2 size={13} />
                      Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-50/50 rounded-2xl p-12 text-center border border-dashed border-neutral-200 shadow-sm">
          <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center text-neutral-400 mb-4 border border-neutral-200 shadow-sm">
            <FileClock size={24} />
          </div>
          <h3 className="text-base font-bold text-neutral-800 mb-1">No drafts found</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            You don't have any incomplete submissions at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicantDrafts;