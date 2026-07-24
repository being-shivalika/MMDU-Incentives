import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../../components/Ui/Card";
import Badge from "../../../components/Ui/Badge";
import { departmentReviewMockData } from "../departmentReviewMockData";
import { ArrowLeft, Check, ArrowRight, CornerUpLeft, X } from "lucide-react";
import dayjs from "dayjs";

const SubmissionReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const data = departmentReviewMockData.find((s) => s.id === id);
    setSubmission(data);
  }, [id]);

  if (!submission) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Loading submission details...</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "pending_review":
        return <Badge variant="warning">Pending Review</Badge>;
      case "returned":
      case "rejected":
        return <Badge variant="danger">Returned</Badge>;
      case "forwarded":
        return <Badge variant="info">Forwarded</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Submission {submission.id}</h1>
        {getStatusBadge(submission.status)}
      </div>

      <Card className="space-y-8">
        <section>
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Applicant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{submission.applicant.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{submission.applicant.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Designation</p>
              <p className="font-medium">{submission.applicant.designation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{submission.applicant.email}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Research Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium">{submission.title}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{submission.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted Date</p>
                <p className="font-medium">{dayjs(submission.submittedAt).format("DD MMM YYYY")}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm mt-1">{submission.description}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Attachments</h3>
          <div className="flex flex-col gap-2">
            {submission.files.map((file, idx) => (
              <a 
                key={idx} 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" /> {file.name}
              </a>
            ))}
          </div>
        </section>

        <div className="flex gap-4 pt-6 border-t">
          <button className="flex-1 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <Check className="h-4 w-4" /> Approve
          </button>
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <ArrowRight className="h-4 w-4" /> Forward
          </button>
          <button className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
            <CornerUpLeft className="h-4 w-4" /> Return
          </button>
          <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <X className="h-4 w-4" /> Reject
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SubmissionReviewDetails;
