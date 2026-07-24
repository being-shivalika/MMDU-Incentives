import React, { useState } from "react";
import { X, Check, ArrowRight, CornerUpLeft, ExternalLink } from "lucide-react";
import VerificationTimeline from "./VerificationTimeline";
import VerificationChecklist from "./VerificationChecklist";
import VerificationComments from "./VerificationComments";

const VerificationDrawer = ({ submission, isOpen, onClose, onAction }) => {
  if (!isOpen || !submission) return null;

  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Research Verification</h2>
            <p className="text-sm text-gray-500">{submission.id} • {submission.type}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b px-6 flex gap-6">
          <button 
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "details" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"}`}
            onClick={() => setActiveTab("details")}
          >
            Details & Verification
          </button>
          <button 
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "timeline" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"}`}
            onClick={() => setActiveTab("timeline")}
          >
            History & Comments
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
          {activeTab === "details" ? (
            <>
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Applicant Information</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 border">
                  <p className="font-medium text-lg">{submission.applicant.name}</p>
                  <p className="text-sm text-gray-600">{submission.applicant.type} - {submission.applicant.id}</p>
                  <p className="text-sm text-gray-600">{submission.department}</p>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Research Metadata</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium text-gray-900">{submission.title}</p>
                  </div>
                  
                  {submission.type === "Publication" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Journal Name</p>
                        <p className="font-medium text-gray-900">{submission.journalName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Indexing & Impact</p>
                        <p className="font-medium text-gray-900">{submission.indexing} • IF: {submission.impactFactor}</p>
                      </div>
                    </div>
                  )}

                  {submission.type === "Patent" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Application No</p>
                        <p className="font-medium text-gray-900">{submission.applicationNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Patent Status</p>
                        <p className="font-medium text-gray-900">{submission.patentStatus}</p>
                      </div>
                    </div>
                  )}

                  {submission.type === "Project" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Funding Agency</p>
                        <p className="font-medium text-gray-900">{submission.fundingAgency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium text-gray-900">{submission.amount}</p>
                      </div>
                    </div>
                  )}
                  
                  {submission.type === "Consultancy" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="font-medium text-gray-900">{submission.client}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-medium text-gray-900">{submission.revenue}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Verification Checklist</h3>
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <VerificationChecklist submissionType={submission.type} />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Verification Links</h3>
                <a href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <ExternalLink className="h-4 w-4" /> Open UGC Care / Scopus / Web of Science Database
                </a>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Progress Timeline</h3>
                <VerificationTimeline timeline={submission.timeline} />
              </section>

              <section className="mt-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Reviewer Comments</h3>
                <VerificationComments comments={submission.comments} />
              </section>
            </>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3 flex-wrap">
          <button onClick={() => onAction("Approve")} className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
            <Check className="h-4 w-4" /> Verify
          </button>
          <button onClick={() => onAction("Forward")} className="flex-1 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <ArrowRight className="h-4 w-4" /> Forward to Accounts
          </button>
          <button onClick={() => onAction("Return")} className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
            <CornerUpLeft className="h-4 w-4" /> Return with Comment
          </button>
          <button onClick={() => onAction("Reject")} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <X className="h-4 w-4" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationDrawer;
