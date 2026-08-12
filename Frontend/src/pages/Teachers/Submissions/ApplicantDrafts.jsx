import React, { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { FileClock, Edit2, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSubmissions, deleteSubmission } from "../../../services/submissionService";

const ApplicantDrafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const response = await getSubmissions({ status: "DRAFT" });
      const data = response.data || response.claims || [];
      setDrafts(data);
    } catch (err) {
      console.error("Failed to fetch drafts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    try {
      await deleteSubmission(id);
      await loadDrafts();
    } catch (err) {
      alert("Failed to delete draft: " + err.message);
    }
  };

  const handleEditDraft = (draft) => {
    const id = draft.id || draft._id;
    const sub = String(draft.subtype || draft.typeId || draft.category || "").toLowerCase();
    
    let path = "/applicant/submissions/create/publication";
    if (sub.includes("conference")) path = "/applicant/submissions/create/conference";
    else if (sub.includes("book_chapter")) path = "/applicant/submissions/create/book_chapter";
    else if (sub.includes("book")) path = "/applicant/submissions/create/book";
    else if (sub.includes("patent")) path = "/applicant/submissions/create/patent";
    else if (sub.includes("copyright")) path = "/applicant/submissions/create/copyright";
    else if (sub.includes("startup") || sub.includes("project") || sub.includes("consultancy")) path = "/applicant/submissions/create/project";

    navigate(`${path}?draftId=${id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-left">
      <PageHeader
        title="My Drafts"
        subtitle="Resume your incomplete research submissions."
        icon={FileClock}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2">
          <Loader2 className="h-6 w-6 text-neutral-400 animate-spin" />
          <p className="text-xs text-neutral-500 font-medium">Loading drafts...</p>
        </div>
      ) : drafts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => {
            const id = draft.id || draft._id;
            return (
              <div 
                key={id} 
                className="group relative flex flex-col justify-between bg-white border border-neutral-200 rounded-xl p-5 shadow-sm transition-all duration-200 hover:border-neutral-800 hover:shadow-md"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {draft.subtype || draft.category || "Draft"}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      {draft.claimNumber || id}
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
                      <span>Status</span>
                      <span className="text-amber-600 font-bold">Draft (Step 1 of 5)</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200/50">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500 w-[20%]"
                      />
                    </div>
                  </div>
                  
                  {/* Footer Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      {new Date(draft.createdAt || Date.now()).toLocaleDateString("en-GB")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleDelete(id)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" 
                        title="Delete Draft"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditDraft(draft)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 text-white text-xs font-semibold rounded-lg hover:bg-neutral-950 transition-colors shadow-sm cursor-pointer"
                      >
                        <Edit2 size={13} />
                        View / Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-neutral-50/50 rounded-2xl p-12 text-center border border-dashed border-neutral-200 shadow-sm">
          <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center text-neutral-400 mb-4 border border-neutral-200 shadow-sm">
            <FileClock size={24} />
          </div>
          <h3 className="text-base font-bold text-neutral-800 mb-1">No drafts found</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            You don't have any incomplete saved drafts at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicantDrafts;