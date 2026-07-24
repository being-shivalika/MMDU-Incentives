import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CornerUpLeft, X, ArrowRight } from "lucide-react";
import Card from "../../../components/Ui/Card";
import VerificationTimeline from "../Dashboard/components/VerificationTimeline";
import VerificationChecklist from "../Dashboard/components/VerificationChecklist";
import VerificationComments from "../Dashboard/components/VerificationComments";
import { researchReviewMockData } from "../mock/researchReviewMockData";

const ResearchReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    // Simulate fetching data
    const found = researchReviewMockData.find(s => s.id === id);
    if (found) {
      setSubmission(found);
    }
  }, [id]);

  if (!submission) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const handleAction = (action) => {
    console.log(`Action ${action} taken on ${submission.id}`);
    navigate("/research-review/queue");
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submission Details</h1>
          <p className="text-sm text-gray-500">{submission.id} • {submission.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Applicant Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{submission.applicant.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type & ID</p>
                <p className="font-medium text-gray-900">{submission.applicant.type} - {submission.applicant.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{submission.department}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Research Metadata</h3>
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

              {/* Other types would follow similarly */}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Verification Checklist</h3>
            <VerificationChecklist submissionType={submission.type} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Actions</h3>
            <div className="space-y-3">
              <button onClick={() => handleAction("Approve")} className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Check className="h-4 w-4" /> Verify
              </button>
              <button onClick={() => handleAction("Forward")} className="w-full bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <ArrowRight className="h-4 w-4" /> Forward to Accounts
              </button>
              <button onClick={() => handleAction("Return")} className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <CornerUpLeft className="h-4 w-4" /> Return with Comment
              </button>
              <button onClick={() => handleAction("Reject")} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <X className="h-4 w-4" /> Reject
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Progress</h3>
            <VerificationTimeline timeline={submission.timeline} />
          </Card>
          
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Reviewer Comments</h3>
            <VerificationComments comments={submission.comments} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearchReviewDetails;
