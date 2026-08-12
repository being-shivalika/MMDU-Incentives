import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissionById } from "../../../services/submissionService";
import WorkflowProgressTracker from "../../../components/Ui/WorkflowProgressTracker";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  CheckCircle2,
  Clock,
  Wallet,
  Activity,
  AlertCircle,
  Edit,
  Loader2,
} from "lucide-react";

// --- Helper Functions ---
const formatString = (str) => {
  if (!str) return "N/A";
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getStatusStyle = (status) => {
  const safeStatus = status?.toUpperCase() || "";
  if (safeStatus.includes("DRAFT"))
    return "bg-neutral-100 text-neutral-600 border-neutral-200";
  if (safeStatus.includes("REVIEW") || safeStatus.includes("PENDING"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (safeStatus.includes("APPROVED") || safeStatus.includes("VERIFIED"))
    return "bg-green-50 text-green-700 border-green-200";
  if (safeStatus.includes("REJECTED") || safeStatus.includes("REVISION"))
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-neutral-100 text-neutral-600 border-neutral-200";
};

const formatKey = (key, submission = {}) => {
  const sub = String(submission.subtype || submission.category || "").toLowerCase();
  const keyMap = {
    title: "Title of Work",
    domain: "Research Area / Domain",
    dropdown: "Submission Category / Type",
    journalName: "Name of Journal",
    quartile: "Quartile Rank",
    impactFactor: "Impact Factor",
    quartileProof: "Quartile Proof URL",
    volumeNo: "Volume No",
    issueNo: "Issue No",
    pageNo: "Page No / Range",
    conferenceTitle: "Name of Conference / Seminar",
    conferenceLevel: "Conference Level",
    authorType: "Type of Author(s)",
    indexingTier: "Indexing Tier",
    organizedBy: "Organised By",
    startDate: "Conference Start Date",
    endDate: "Conference End Date",
    venue: "Venue / Location",
    authorEditorName: "Author / Editor",
    bookTitle: "Book Title",
    chapterNumber: "Chapter Number / Title",
    bookEditors: "Book Editors",
    publisherName: "Publisher Name",
    publicationYear: "Publication Year",
    edition: "Edition",
    chapterDetails: "Chapter Details",
    pageCount: "Page Count",
    inventorDetails: "Inventor Details",
    applicationNumber: "Application Number",
    patentCategory: "Patent Category",
    technologyDomain: "Technology Domain",
    filingDate: "Filing Date",
    grantDate: "Grant Date",
    certified: "Self-Certified",
    firstVerification: sub.includes("conference") ? "Paper Link / DOI / Proceeding URL" : sub.includes("book") ? "ISBN / DOI Link" : sub.includes("patent") ? "Patent Number / Link" : "Paper Link / DOI",
    secondVerification: sub.includes("conference") ? "Scopus / Indexing Link" : sub.includes("book") ? "Publisher Website / Indexing" : sub.includes("patent") ? "Patent Office Link" : "Scopus / Indexing Link",
    thirdVerification: sub.includes("patent") ? "Filing Link" : "Publisher / Additional Link",
    fourthVerification: sub.includes("patent") ? "Verification URL" : "Supporting Document",
  };
  return (
    keyMap[key] ||
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  );
};

const renderValue = (value) => {
  if (!value) return <span className="text-neutral-400">N/A</span>;
  if (typeof value === "string" && value.includes("http")) {
    const cleanUrl = value
      .replace(/\[.*\]\(/, "")
      .replace(/\)/, "")
      .trim();
    return (
      <a
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline break-all"
      >
        <span className="line-clamp-1">{cleanUrl}</span>
        <ExternalLink className="h-3 w-3 flex-shrink-0" />
      </a>
    );
  }
  return (
    <span className="text-neutral-800 font-medium break-words">
      {value.toString()}
    </span>
  );
};

// --- Main Component ---
const ApplicantSubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      setLoading(true);
      try {
        const response = await getSubmissionById(id);
        setSubmission(response.data || null);
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissionDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="text-sm font-medium text-neutral-500">
          Loading submission details...
        </p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-neutral-800">
          Submission Not Found
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  const {
    title,
    category,
    submissionType,
    type,
    publicationDetails,
    incentiveInfo,
    workflowHistory,
    status,
    currentLevel,
  } = submission;

  const isRejected = status === "Rejected" || status === "Revision Requested";
  const isDraftStatus = String(status || "").toUpperCase().includes("DRAFT");

  const handleResumeDraft = () => {
    const sub = String(submissionType || type || category || "").toLowerCase();
    let path = "/applicant/submissions/create/publication";
    if (sub.includes("conference")) path = "/applicant/submissions/create/conference";
    else if (sub.includes("book_chapter")) path = "/applicant/submissions/create/book_chapter";
    else if (sub.includes("book")) path = "/applicant/submissions/create/book";
    else if (sub.includes("patent")) path = "/applicant/submissions/create/patent";
    else if (sub.includes("copyright")) path = "/applicant/submissions/create/copyright";
    else if (sub.includes("startup") || sub.includes("project") || sub.includes("consultancy")) path = "/applicant/submissions/create/project";

    navigate(`${path}?draftId=${id}`);
  };

  const lastReturnHistory =
    isRejected && workflowHistory
      ? [...workflowHistory]
          .reverse()
          .find(
            (h) => h.action === "Rejected" || h.action === "Revision Requested",
          )
      : null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* HEADER SECTION */}
      <div className="space-y-4">
        <button
          onClick={() => navigate("/applicant/submissions")}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 font-semibold transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Submissions
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-neutral-150 pb-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <FileText className="h-3.5 w-3.5 text-neutral-400" />
              <span>{formatString(category)}</span>
              {(submissionType || type) && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span>{formatString(submissionType || type)}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-800 leading-tight">
              {title || "Untitled Submission"}
            </h1>
          </div>

          <div className="flex flex-col items-end gap-3 flex-shrink-0 pt-1">
            <span
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md border ${getStatusStyle(status)}`}
            >
              {status || "Unknown Status"}
            </span>

            {isDraftStatus && (
              <button
                onClick={handleResumeDraft}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#8C0404] hover:bg-[#6F0303] text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                Resume & Complete Draft
              </button>
            )}

            {isRejected && (
              <button
                onClick={() => navigate(`/applicant/submissions/${id}/edit`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition shadow-sm"
              >
                <Edit className="h-3.5 w-3.5" />
                Reopen & Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* REJECTION / REVISION ALERT */}
      {isRejected && lastReturnHistory && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">
              Action Required: {status}
            </h3>
            <p className="text-sm text-red-800 leading-relaxed">
              Returned by{" "}
              <span className="font-bold">{lastReturnHistory.level}</span> (
              {lastReturnHistory.by}).
              <br />
              <span className="font-semibold mt-1 block">Remarks:</span>{" "}
              {lastReturnHistory.remarks || "No specific remarks provided."}
            </p>
          </div>
        </div>
      )}

      {/* DYNAMIC WORKFLOW PROGRESS DIAGRAM */}
      <WorkflowProgressTracker 
        workflowProgress={submission.workflowProgress} 
        isHeld={submission.isHeld} 
        heldReason={submission.heldReason} 
      />

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - MAIN DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          {/* SUBMISSION & PUBLICATION DETAILS */}
          {submission && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Submission & Claim Details
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  {Object.entries(
                    submission.metadata || submission.fields || submission.publicationDetails || {}
                  ).map(([key, value]) => {
                    if (
                      value === undefined ||
                      value === null ||
                      value === "" ||
                      value === false ||
                      (Array.isArray(value) && value.length === 0) ||
                      key === "verificationLinks" ||
                      key === "_id" ||
                      key === "__v"
                    ) {
                      return null;
                    }

                    if (key === "authors" && Array.isArray(value)) {
                      return (
                        <div key={key} className="space-y-1.5 md:col-span-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            Authors & Co-authors
                          </span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {value.map((auth, aIdx) => (
                              <span
                                key={aIdx}
                                className="px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800"
                              >
                                {auth.name || auth} {auth.department ? `(${auth.department})` : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="space-y-1.5 overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {formatKey(key, submission)}
                        </span>
                        <div className="text-sm">{renderValue(value)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VERIFICATION LINKS COMPONENT INTEGRATION */}
          {publicationDetails?.verificationLinks?.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm p-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-4">
                Verification Links
              </h2>
              {/* Assuming your existing component handles the rendering nicely. If not, map them here manually using renderValue */}
              <div className="space-y-3">
                {publicationDetails.verificationLinks.map((link, idx) => (
                  <div key={idx} className="text-sm">
                    {renderValue(link)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEW HISTORY (Only showing remarks from workflow) */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Review Remarks
              </h2>
            </div>
            <div className="p-0">
              {workflowHistory && workflowHistory.some((h) => h.remarks) ? (
                <ul className="divide-y divide-neutral-100">
                  {workflowHistory
                    .filter((h) => h.remarks)
                    .map((hist, idx) => (
                      <li
                        key={idx}
                        className="p-5 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                            <span>{hist.level}</span>
                            <span className="text-neutral-400">•</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (hist.isRejected || hist.action?.includes('Reject')) ? 'bg-red-100 text-red-700 border border-red-300 flex items-center gap-1' :
                              (hist.isReturned || hist.action?.includes('Revision')) ? 'bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1' :
                              'text-neutral-600'
                            }`}>
                              {(hist.isRejected || hist.isReturned || hist.action?.includes('Reject') || hist.action?.includes('Revision')) && (
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse inline-block"></span>
                              )}
                              {hist.action}
                            </span>
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            {new Date(hist.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-100/50 p-3 rounded-lg border border-neutral-100">
                          "{hist.remarks}"
                        </p>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-sm font-medium text-neutral-400">
                  No review remarks available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - STATUS & WORKFLOW */}
        <div className="lg:col-span-1 space-y-6">
          {/* INCENTIVE STATUS */}
          {incentiveInfo && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-neutral-500" />
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Incentive Status
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs font-semibold text-neutral-500">
                    Category
                  </span>
                  <span className="text-xs font-bold text-neutral-800 text-right max-w-[150px] truncate">
                    {formatString(incentiveInfo.incentiveCategory)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-neutral-100 pt-3">
                  <span className="text-xs font-semibold text-neutral-500">
                    Eligibility
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                    {incentiveInfo.eligibleIncentive
                      ?.toString()
                      .toLowerCase()
                      .includes("yes") ||
                    incentiveInfo.eligibleIncentive === true ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />{" "}
                        Yes
                      </>
                    ) : (
                      <span className="text-neutral-500">
                        {incentiveInfo.eligibleIncentive || "No"}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-neutral-100 pt-3">
                  <span className="text-xs font-semibold text-neutral-500">
                    Total Incentive
                  </span>
                  <span className="text-sm font-bold text-neutral-800">
                    ₹{submission.totalIncentive || submission.approvedAmount || submission.calculatedAmount || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-neutral-100 pt-3">
                  <span className="text-xs font-semibold text-neutral-500">
                    MMDU Authors
                  </span>
                  <span className="text-xs font-bold text-neutral-800">
                    {submission.mmduAuthorCount || 1} Author(s)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-neutral-100 pt-3 bg-blue-50/50 p-2 rounded-lg">
                  <span className="text-xs font-bold text-blue-900">
                    Your Payable Share
                  </span>
                  <span className="text-sm font-black text-blue-900">
                    ₹{submission.userShare || submission.individualShare || submission.approvedAmount || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-neutral-100 pt-3">
                  <span className="text-xs font-semibold text-neutral-500">
                    Claim Status
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                    submission.isHeld ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {submission.isHeld ? 'Payment Held (1st Pub)' : (incentiveInfo.claimStatus || "Pending")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* WORKFLOW TRACKING TIMELINE */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2">
              <Activity className="h-4 w-4 text-neutral-500" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Workflow Progress
              </h2>
            </div>

            <div className="p-5">
              <div className="mb-6 space-y-1">
                <p className="text-xs text-neutral-500 flex justify-between">
                  <span>Current Stage:</span>
                  <span className="font-bold text-neutral-800">
                    {currentLevel || "N/A"}
                  </span>
                </p>
                <p className="text-xs text-neutral-500 flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-bold text-neutral-800">
                    {workflowHistory?.length > 0
                      ? new Date(
                          workflowHistory[workflowHistory.length - 1].date,
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </p>
              </div>

              {/* TIMELINE UI REFINED */}
              <div className="relative border-l border-neutral-200 ml-2 space-y-6">
                {workflowHistory &&
                  workflowHistory
                    .filter((stage) => {
                      const act = String(stage.action || "").toUpperCase();
                      const lvl = String(stage.level || "").toUpperCase();
                      return !act.includes("DRAFT") && !lvl.includes("DRAFT");
                    })
                    .map((stage, idx, arr) => {
                      const isLast = idx === arr.length - 1;
                      const isRejectedOrReturned =
                        stage.isRejected ||
                        stage.isReturned ||
                        stage.action.includes("Reject") ||
                        stage.action.includes("Revision") ||
                        stage.action.includes("Return");

                    let dotColor = "bg-green-500 border-white"; // past approved step
                    if (isRejectedOrReturned) {
                      dotColor = "bg-red-600 border-white ring-4 ring-red-100 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse";
                    } else if (isLast) {
                      dotColor = "bg-blue-600 border-white ring-4 ring-blue-100 shadow-[0_0_0_3px_rgba(37,99,235,0.2)]";
                    }

                    return (
                      <div key={idx} className="relative pl-6">
                        {/* Timeline Dot */}
                        <div
                          className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${dotColor}`}
                        ></div>

                        <div className="space-y-0.5">
                          <p
                            className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              isRejectedOrReturned
                                ? "text-red-700 font-extrabold"
                                : isLast
                                ? "text-neutral-800"
                                : "text-neutral-500"
                            }`}
                          >
                            <span>{stage.level}</span>
                            <span className="lowercase font-medium text-neutral-400">
                              ({stage.action})
                            </span>
                            {isRejectedOrReturned && (
                              <span className="h-2 w-2 rounded-full bg-red-600 animate-ping inline-block"></span>
                            )}
                          </p>
                          <p className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            <Clock className="h-2.5 w-2.5" />
                            {new Date(stage.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantSubmissionDetails;
