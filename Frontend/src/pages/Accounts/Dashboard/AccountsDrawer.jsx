import React, { useState } from "react";
import { X, Check } from "lucide-react";
import dayjs from "dayjs";
import Badge from "../../../components/Ui/Badge";

const AccountsDrawer = ({ submission, isOpen, onClose, onAction }) => {
  const [remarks, setRemarks] = useState("");

  if (!isOpen || !submission) return null;

  const handleActionClick = (actionType) => {
    onAction(actionType, remarks);
    setRemarks(""); // Reset remarks
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Payment Processing
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-left">
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Applicant Details
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 border">
              <p className="font-medium text-lg">
                {submission.creatorName ||
                  submission.submittedBy ||
                  "Unknown Applicant"}
              </p>
              <p className="text-sm text-gray-600">
                Department:{" "}
                {submission.department || submission.creatorDept || "Unknown"}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Research & Metadata
            </h3>
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
                  <p className="font-medium">
                    {submission.submissionType ||
                      submission.type ||
                      submission.category}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <p className="font-medium">
                    {dayjs(
                      submission.dateSubmitted || submission.submittedAt,
                    ).format("DD MMM YYYY")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                {(submission.metadata?.journalName || submission.fields?.journalName || submission.metadata?.conferenceTitle || submission.fields?.conferenceTitle) && (
                  <div className="flex-1 bg-gray-50 border p-3 rounded-lg">
                    <p className="text-xs text-gray-500 font-semibold uppercase">
                      {submission.metadata?.journalName || submission.fields?.journalName ? "Name of Journal" : "Name of Conference / Seminar"}
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {submission.metadata?.journalName || submission.fields?.journalName || submission.metadata?.conferenceTitle || submission.fields?.conferenceTitle}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 border p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    Quartile
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.metadata?.quartile ||
                      submission.fields?.quartile ||
                      "N/A"}
                  </p>
                </div>
                <div className="flex-1 bg-gray-50 border p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    Impact Factor
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.metadata?.impactFactor ||
                      submission.fields?.impactFactor ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[120px] bg-gray-50 border p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    Volume No.
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.metadata?.volumeNo || submission.fields?.volumeNo || "N/A"}
                  </p>
                </div>
                <div className="flex-1 min-w-[120px] bg-gray-50 border p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    Issue No.
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.metadata?.issueNo || submission.fields?.issueNo || "N/A"}
                  </p>
                </div>
                <div className="flex-1 min-w-[120px] bg-gray-50 border p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    Page No.
                  </p>
                  <p className="font-medium text-gray-900">
                    {submission.metadata?.pageNo || submission.fields?.pageNo || "N/A"}
                  </p>
                </div>
              </div>

              {(submission.metadata?.quartileProof || submission.fields?.quartileProof) && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex justify-between items-center text-xs font-semibold">
                  <span className="text-blue-800 uppercase tracking-wide">Quartile Proof:</span>
                  <a
                    href={submission.metadata?.quartileProof || submission.fields?.quartileProof}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-bold break-all flex items-center gap-1"
                  >
                    View Proof Document / Link ↗
                  </a>
                </div>
              )}
              <div className="mt-4 pt-4 bg-green-50 p-4 rounded-xl border border-green-200 space-y-2">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">
                  Financial & Author Split Information (Policy 2026)
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-800">Total Publication Incentive:</span>
                  <span className="font-bold text-green-900">₹{submission.totalIncentive || submission.approvedAmount || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-800">MMDU Authors Count:</span>
                  <span className="font-bold text-green-900">{submission.mmduAuthorCount || 1}</span>
                </div>
                <div className="flex justify-between items-center border-t border-green-200 pt-2">
                  <span className="text-sm font-bold text-green-900">Individual Payable Share:</span>
                  <span className="font-bold text-2xl text-green-900">
                    ₹{submission.individualShare || submission.userShare || submission.incentiveAmount || 0}
                  </span>
                </div>

                {submission.isHeld && (
                  <div className="mt-2 p-2.5 bg-amber-100 border border-amber-300 rounded-lg text-xs font-bold text-amber-900">
                    ⚠️ {submission.heldReason || "Payment held until second eligible publication is approved per policy."}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Payment Details / Remarks
                </p>
                <textarea
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  rows="3"
                  placeholder="Enter transaction ID, reference number, or other payment remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3 flex-wrap">
          {submission.isPaid ? (
            <div className="w-full text-center text-xs font-bold text-emerald-800 uppercase tracking-wider py-3 bg-emerald-100 border border-emerald-300 rounded-xl">
              ✔ Payment Disbursed & Bank Credited (Released Payment)
            </div>
          ) : (Number(submission.individualShare || submission.userShare || submission.incentiveAmount || 0) <= 0 || submission.isHeld) ? (
            <div className="w-full text-center text-xs font-bold text-amber-800 uppercase tracking-wider py-3 bg-amber-50 border border-amber-200 rounded-xl">
              ⚠️ Payment Not Applicable — {submission.isHeld ? 'Held' : 'Incentive amount is ₹0 per policy (Min 3 Q3/Q4 required)'}
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row gap-3">
              {!submission.isAccountsApproved && (
                <button
                  onClick={() => handleActionClick("Approve Payment")}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Check className="h-5 w-5" /> Step 1: Approve Payment Amount
                </button>
              )}
              <button
                onClick={() => handleActionClick("Process Payment")}
                className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Check className="h-5 w-5" /> {submission.isAccountsApproved ? "Tick as Paid (Release Payment)" : "Step 2: Tick as Paid"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsDrawer;
