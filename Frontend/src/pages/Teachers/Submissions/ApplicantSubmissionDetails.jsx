import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Badge from "../../../components/Ui/Badge";
import Card from "../../../components/Ui/Card";
import VerificationLinks from "../../../components/Ui/VerificationLinks";
import { getMockSubmissions } from "../../../utils/mockBackend";

const ApplicantSubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchSubmissionDetails = async () => {
      setLoading(true);
      try {
        const allSubmissions = getMockSubmissions();
        const found = allSubmissions.find(s => s.id === id);

        setTimeout(() => {
          setSubmission(found || null);
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error("Failed to load details", error);
        setLoading(false);
      }
    };

    fetchSubmissionDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500 animate-pulse">Loading submission details...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-red-600">Submission not found</h1>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const { generalInfo, publicationDetails, workflowInfo, reviewInfo, incentiveInfo, permissions } = submission;

  const getBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed": return "success";
      case "rejected": return "danger";
      case "under review":
      case "submitted": return "info";
      case "revision requested": return "warning";
      default: return "neutral";
    }
  };

  const handleEdit = () => {
    // Navigate to the edit page 
    navigate(`/applicant/submissions/${id}/edit`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <button onClick={() => navigate("/applicant/submissions")} className="text-blue-600 hover:underline mb-2 flex items-center text-sm">
            &larr; Back to Submissions
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{generalInfo.title}</h1>
          <p className="text-gray-500 mt-1">{generalInfo.submissionType} • {generalInfo.category}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={getBadgeVariant(workflowInfo.status)} className="text-sm px-3 py-1">
            {workflowInfo.status}
          </Badge>
          {permissions.canEdit && workflowInfo.status.toLowerCase() === "rejected" && (
            <button 
              onClick={handleEdit}
              className="mt-2 px-4 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 transition"
            >
              Reopen & Edit
            </button>
          )}
        </div>
      </div>

      {/* Rejection Alert */}
      {workflowInfo.status.toLowerCase() === "rejected" && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Submission Rejected</h3>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Reason:</strong> {reviewInfo.rejectionReason}</p>
                {reviewInfo.reviewerRemarks && <p className="mt-1"><strong>Remarks:</strong> {reviewInfo.reviewerRemarks}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <Card className="p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">General Information</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <span className="block text-sm text-gray-500">Domain</span>
                <span className="font-medium">{generalInfo.domain || "N/A"}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Sub Domain</span>
                <span className="font-medium">{generalInfo.subDomain || "N/A"}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-sm text-gray-500">Description</span>
                <p className="mt-1 text-gray-700">{generalInfo.description}</p>
              </div>
            </div>
          </Card>

          {/* Publication / Claim Details (Dynamic) */}
          <Card className="p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Publication / Claim Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              {Object.entries(publicationDetails).map(([key, value]) => {
                if (key === "verificationLinks") return null; // We handle links separately
                return (
                  <div key={key}>
                    <span className="block text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-gray-800">{value?.toString() || "N/A"}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Verification Links */}
          <VerificationLinks links={publicationDetails.verificationLinks} />

          {/* Review Information */}
          <Card className="p-6 shadow-sm border border-gray-100 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Review Information</h2>
            <div className="space-y-4">
              {reviewInfo.reviewerRemarks && (
                <div>
                  <span className="block text-sm text-gray-500 font-medium">Reviewer Remarks</span>
                  <p className="mt-1 text-gray-700 bg-white p-3 rounded border">{reviewInfo.reviewerRemarks}</p>
                </div>
              )}
              {reviewInfo.revisionRequests && (
                <div>
                  <span className="block text-sm text-gray-500 font-medium">Revision Requests</span>
                  <p className="mt-1 text-gray-700 bg-white p-3 rounded border">{reviewInfo.revisionRequests}</p>
                </div>
              )}
              {reviewInfo.approvalNotes && (
                <div>
                  <span className="block text-sm text-gray-500 font-medium">Approval Notes</span>
                  <p className="mt-1 text-gray-700 bg-white p-3 rounded border">{reviewInfo.approvalNotes}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Incentive Information */}
          <Card className="p-6 shadow-sm border border-green-100 bg-green-50">
            <h2 className="text-lg font-semibold mb-4 text-green-900 border-b border-green-200 pb-2">Incentive Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-green-200 pb-2">
                <span className="text-sm text-green-800">Category</span>
                <span className="font-medium text-green-900">{incentiveInfo.incentiveCategory}</span>
              </div>
              <div className="flex justify-between border-b border-green-200 pb-2">
                <span className="text-sm text-green-800">Eligibility</span>
                <span className="font-medium text-green-900">{incentiveInfo.eligibleIncentive}</span>
              </div>
              <div className="flex justify-between border-b border-green-200 pb-2">
                <span className="text-sm text-green-800">Estimated Amount</span>
                <span className="font-bold text-green-900">{incentiveInfo.estimatedAmount}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-sm text-green-800">Claim Status</span>
                <span className="font-medium text-green-900 bg-green-200 px-2 py-0.5 rounded text-xs">{incentiveInfo.claimStatus}</span>
              </div>
            </div>
          </Card>

          {/* Workflow Tracking */}
          <Card className="p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Workflow Progress</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Current Stage: <span className="font-medium text-gray-900">{workflowInfo.currentReviewLevel}</span></p>
              <p className="text-sm text-gray-500">Authority: <span className="font-medium text-gray-900">{workflowInfo.reviewingAuthority}</span></p>
              <p className="text-sm text-gray-500">Last Updated: <span className="font-medium text-gray-900">{new Date(workflowInfo.lastUpdated).toLocaleDateString()}</span></p>
            </div>
            
            {/* Timeline UI */}
            <div className="relative border-l-2 border-gray-200 ml-3 mt-6 space-y-6">
              {workflowInfo.history && workflowInfo.history.map((stage, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white ${stage.completed ? "bg-blue-600" : "bg-gray-300"}`}></div>
                  <div>
                    <p className={`text-sm font-medium ${stage.completed ? "text-gray-900" : "text-gray-400"}`}>{stage.stage}</p>
                    <p className="text-xs text-gray-500">{stage.date !== "Pending" ? new Date(stage.date).toLocaleString() : "Pending"}</p>
                    {stage.remarks && <p className="text-xs text-gray-600 mt-1 italic">{stage.remarks}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantSubmissionDetails;
