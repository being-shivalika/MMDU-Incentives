import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  X,
  Check,
  CornerUpLeft,
  XCircle,
  User,
  Building2,
  BookOpen,
  IndianRupee,
  Clock,
  ExternalLink,
  Users,
} from "lucide-react";

import Badge from "../../../../components/Ui/Badge";
import ActionButton from "../../../../shared/components/ActionButton";
import WorkflowProgressTracker from "../../../../components/Ui/WorkflowProgressTracker";

const ReviewDrawer = ({ submission, isOpen, onClose, onAction }) => {
  const [remarks, setRemarks] = useState("");

  if (!isOpen || !submission) return null;

  const metadata =
    submission.metadata ||
    submission.fields ||
    submission.publicationDetails ||
    {};

  const incentive = submission.incentiveInfo || {};
  const history =
    submission.workflowHistory ||
    submission.history ||
    submission.reviewHistory ||
    submission.workflow ||
    [];

  const timeline = useMemo(() => {
    const items = [...history]
      .filter((h) => {
        const act = String(h.action || h.status || "").toUpperCase();
        const step = String(h.step || h.level || "").toUpperCase();
        return !act.includes("DRAFT") && !step.includes("DRAFT");
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (items.length > 0) {
      return items;
    }

    // Synthesize live workflow timeline if history array is empty
    const synthesized = [];
    const createdDate = submission.dateSubmitted || submission.createdAt || Date.now();
    const applicantName = submission.creatorName || submission.applicantName || "Faculty Member";

    // 1. Initial Submission Event
    synthesized.push({
      level: submission.applicantRole === 'student' ? 'Student Submission' : 'Faculty Submission',
      action: 'Submitted',
      by: applicantName,
      date: createdDate,
      status: 'Submitted'
    });

    // 2. Synthesize from workflowProgress steps if present
    if (submission.workflowProgress && Array.isArray(submission.workflowProgress.steps)) {
      submission.workflowProgress.steps.forEach((st) => {
        if (st.id === 'submit') return;
        if (st.status === 'completed' || st.status === 'active' || st.status === 'rejected' || st.status === 'returned') {
          synthesized.push({
            level: st.label,
            action: st.status === 'completed' ? 'Approved & Forwarded' : st.status === 'active' ? 'Under Active Review' : st.status === 'rejected' ? 'Rejected' : 'Revision Requested',
            by: st.actorName || st.label,
            date: st.date || submission.updatedAt || createdDate,
            status: st.status === 'completed' ? 'Approved' : st.status === 'active' ? 'Pending Action' : st.status
          });
        }
      });
    } else {
      // 3. Fallback based on current workflow status
      const currentStatus = String(submission.status || 'Pending Review');
      if (currentStatus.includes('HOD')) {
        synthesized.push({
          level: 'HOD Review',
          action: 'Under Review',
          by: 'Department HOD',
          date: submission.updatedAt || createdDate,
          status: 'Pending HOD'
        });
      } else if (currentStatus.includes('Principal')) {
        synthesized.push({
          level: 'HOD Review',
          action: 'Approved & Forwarded',
          by: 'HOD',
          date: createdDate,
          status: 'Approved'
        });
        synthesized.push({
          level: 'Principal Review',
          action: 'Under Review',
          by: 'Principal',
          date: submission.updatedAt || createdDate,
          status: 'Pending Principal'
        });
      } else if (currentStatus.includes('RPC') || currentStatus.includes('R & D') || currentStatus.includes('Verification')) {
        synthesized.push({
          level: 'HOD Review',
          action: 'Approved & Forwarded',
          by: 'HOD',
          date: createdDate,
          status: 'Approved'
        });
        synthesized.push({
          level: 'Principal Review',
          action: 'Approved & Forwarded',
          by: 'Principal',
          date: createdDate,
          status: 'Approved'
        });
        synthesized.push({
          level: 'R & D Verification',
          action: 'Under Verification',
          by: 'RPC / R&D Cell',
          date: submission.updatedAt || createdDate,
          status: 'Pending Verification'
        });
      } else if (currentStatus.includes('Accounts') || currentStatus.includes('Payment') || currentStatus.includes('Approved') || currentStatus.includes('Completed')) {
        synthesized.push({
          level: 'HOD Review',
          action: 'Approved & Forwarded',
          by: 'HOD',
          date: createdDate,
          status: 'Approved'
        });
        synthesized.push({
          level: 'Principal Review',
          action: 'Approved & Forwarded',
          by: 'Principal',
          date: createdDate,
          status: 'Approved'
        });
        synthesized.push({
          level: 'R & D Verification',
          action: 'Verified',
          by: 'RPC / R&D Cell',
          date: createdDate,
          status: 'Verified'
        });
        synthesized.push({
          level: 'Accounts Disbursement',
          action: currentStatus.includes('Completed') || currentStatus.includes('Disbursed') ? 'Payment Released' : 'Disbursement Pending',
          by: 'Accounts Office',
          date: submission.updatedAt || createdDate,
          status: currentStatus
        });
      }
    }

    return synthesized;
  }, [submission, history]);

  const handleAction = (action) => {
    onAction(action, remarks);
    setRemarks("");
  };

 const getStatusVariant = (statusText) => {
    if (!statusText) return "default";
    const text = String(statusText).toLowerCase();
    
    // 1. Check for Pending/Action Required states first
    if (text.includes("pending") || text.includes("under") || text.includes("revis") || text.includes("return")) {
      return "warning"; // Amber/Yellow
    }
    // 2. Check for Rejections
    if (text.includes("reject") || text.includes("decline")) {
      return "danger"; // Red
    }
    // 3. Check for Success (Use "verified" exactly so "verification" doesn't falsely trigger)
    if (text.includes("approve") || text.includes("verified") || text.includes("complet") || text.includes("success")) {
      return "success"; // Green
    }
    
    return "default"; // Gray fallback
  };


  const renderField = (label, value) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === false
    ) {
      return null;
    }

    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          {label}
        </p>
        <p className="font-medium text-sm text-neutral-900 break-words">
          {String(value)}
        </p>
      </div>
    );
  };

  const renderLink = (label, value) => {
    if (!value) return null;

    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          {label}
        </p>
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
        >
          {value}
          <ExternalLink size={14} />
        </a>
      </div>
    );
  };

  const getVerificationLabel = (subObj, key) => {
    const sub = String(subObj.subtype || subObj.category || "").toLowerCase();
    
    if (sub.includes("conference")) {
      if (key === "firstVerification") return "Paper Link / DOI / Proceeding URL";
      if (key === "secondVerification") return "Scopus / Indexing Link";
      if (key === "thirdVerification") return "Additional Link";
      if (key === "fourthVerification") return "Supporting Document";
    }
    if (sub.includes("book")) {
      if (key === "firstVerification") return "ISBN / DOI Link";
      if (key === "secondVerification") return "Publisher Website / Indexing";
      if (key === "thirdVerification") return "Book Link";
      if (key === "fourthVerification") return "Indexing Proof";
    }
    if (sub.includes("patent")) {
      if (key === "firstVerification") return "Patent Number / Application Link";
      if (key === "secondVerification") return "Patent Office Link";
      if (key === "thirdVerification") return "Filing Link";
      if (key === "fourthVerification") return "Verification URL";
    }
    if (sub.includes("copyright")) {
      if (key === "firstVerification") return "Copyright Registration Link";
      if (key === "secondVerification") return "Work Link / Diary No";
    }

    // Default Journal Publication
    if (key === "firstVerification") return "Paper Link / DOI";
    if (key === "secondVerification") return "Scopus / Indexing Link";
    if (key === "thirdVerification") return "Publisher URL";
    if (key === "fourthVerification") return "Journal Website";
    
    return key;
  };

  // Shared Card Wrapper for consistent UI
  const SectionCard = ({ icon: Icon, title, children }) => (
    <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-neutral-800 text-base flex items-center gap-2 mb-5 pb-4 border-b border-neutral-100">
        <Icon size={18} className="text-neutral-500" />
        {title}
      </h3>
      {children}
    </section>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative h-full w-full max-w-3xl bg-neutral-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="shrink-0 bg-white border-b border-neutral-200/80 px-8 py-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-black text-neutral-900">Submission Review</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
                {submission.claimNumber || submission.id}
              </span>
              <Badge variant={getStatusVariant(submission.status)}>{submission.status}</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* APPLICANT */}
          <SectionCard icon={User} title="Applicant Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {renderField("Applicant Name", submission.creatorName)}
              {renderField("Department", submission.creatorDept)}
              {renderField("Role", submission.creatorRole)}
              {renderField(
                "Submitted On",
                dayjs(submission.dateSubmitted || submission.createdAt).format("DD MMM YYYY")
              )}
              {renderField("Current Review Level", submission.currentLevel)}
            </div>
          </SectionCard>

          {/* SUBMISSION & RESEARCH DETAILS */}
          <SectionCard icon={BookOpen} title="Research & Submission Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div className="sm:col-span-2">
                {renderField("Submission Title", metadata.title || submission.title)}
              </div>
              {renderField("Research Category", submission.category)}
              {renderField("Submission Type / Form", metadata.dropdown || submission.subtype)}
              {renderField("Research Domain", metadata.domain)}
              
              {metadata.impactFactor && renderField("Impact Factor", metadata.impactFactor)}

              {metadata.quartile && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Quartile</p>
                  <div>
                    <Badge
                      variant={
                        metadata.quartile === "Q1" ? "success"
                          : metadata.quartile === "Q2" ? "warning"
                          : "default"
                      }
                    >
                      {metadata.quartile}
                    </Badge>
                  </div>
                </div>
              )}

              {metadata.authors?.length > 0 && (
                <div className="sm:col-span-2 flex flex-col gap-1.5 mt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Authors</p>
                  <div className="flex flex-wrap gap-2">
                    {metadata.authors.map((author, index) => (
                      <span
                        key={author.id || index}
                        className="px-3 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-sm font-medium border border-neutral-200/60"
                      >
                        {author.name} {author.department ? `(${author.department})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* SPECIFIC VERIFICATION DETAILS */}
          <SectionCard icon={Building2} title="Verification Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              
              {/* Journal Publication */}
              {(submission.subtype === "journal_publication" || submission.category?.toLowerCase()?.includes("publication")) && (
                <>
                  {renderField("Name of Journal", metadata.journalName)}
                  {renderField("Volume No.", metadata.volumeNo)}
                  {renderField("Issue No.", metadata.issueNo)}
                  {renderField("Page No.", metadata.pageNo)}
                  {renderLink("Quartile Proof", metadata.quartileProof)}
                </>
              )}

              {/* Conference / Seminar */}
              {(submission.subtype?.includes("conference") || submission.category?.toLowerCase()?.includes("conference")) && (
                <>
                  {renderField("Name of Conference / Seminar", metadata.conferenceTitle)}
                  {renderField("Level of Conference", metadata.conferenceLevel)}
                  {renderField("Type of Author(s)", metadata.authorType)}
                  {renderField("Indexing Tier", metadata.indexingTier)}
                  {renderField("Organised By", metadata.organizedBy)}
                  {renderField("Conference Start Date", metadata.startDate)}
                  {renderField("Conference End Date", metadata.endDate)}
                  {renderField("Venue / Location", metadata.venue)}
                </>
              )}

              {/* Books */}
              {(submission.subtype === "book" || submission.subtype === "book_chapter") && (
                <>
                  {renderField("Author / Editor", metadata.authorEditorName)}
                  {renderField("Book Title", metadata.bookTitle)}
                  {renderField("Chapter Number / Title", metadata.chapterNumber)}
                  {renderField("Book Editors", metadata.bookEditors)}
                  {renderField("Publisher", metadata.publisherName)}
                  {renderField("Publication Year", metadata.publicationYear)}
                  {renderField("Edition", metadata.edition)}
                  {renderField("Chapter Details", metadata.chapterDetails)}
                  {renderField("Page Count / Range", metadata.pageCount || metadata.pageRange)}
                </>
              )}

              {/* Patents */}
              {submission.subtype?.includes("patent") && (
                <>
                  {renderField("Inventor Details", metadata.inventorDetails)}
                  {renderField("Application Number", metadata.applicationNumber)}
                  {renderField("Patent Category", metadata.patentCategory)}
                  {renderField("Technology Domain", metadata.technologyDomain)}
                  {renderField("Filing Date", metadata.filingDate)}
                  {renderField("Grant Date", metadata.grantDate)}
                </>
              )}

              {/* General Verification Links */}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mt-2 pt-6 border-t border-neutral-100">
                {renderLink(
                  getVerificationLabel(submission, "firstVerification"), 
                  metadata.firstVerification
                )}
                {renderLink(
                  getVerificationLabel(submission, "secondVerification"), 
                  metadata.secondVerification
                )}
                {renderLink(
                  getVerificationLabel(submission, "thirdVerification"), 
                  metadata.thirdVerification
                )}
                {renderLink(
                  getVerificationLabel(submission, "fourthVerification"), 
                  metadata.fourthVerification
                )}
              </div>
            </div>
          </SectionCard>

          {/* ====================================================== */}
          {/* INCENTIVE */}
          {/* ====================================================== */}
          <SectionCard icon={IndianRupee} title="Incentive Evaluation">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Quartile</p>
                <Badge variant="success">{metadata.quartile || "-"}</Badge>
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Estimated Amount</p>
                <p className="font-bold text-lg text-neutral-900">
                  ₹{incentive.estimatedAmount ?? "Pending"}
                </p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Eligibility</p>
                <p className="font-semibold text-sm text-neutral-700">
                  {incentive.eligibleIncentive || "Pending Evaluation"}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* WORKFLOW PROGRESS TRACKER DIAGRAM */}
          {submission.workflowProgress && (
            <WorkflowProgressTracker
              workflowProgress={submission.workflowProgress}
              isHeld={submission.isHeld}
              heldReason={submission.heldReason}
            />
          )}

          {/* ====================================================== */}
          {/* TIMELINE */}
          {/* ====================================================== */}
          {/* ====================================================== */}
          {/* TIMELINE */}
          {/* ====================================================== */}
          <SectionCard icon={Clock} title="Workflow Timeline">
            {timeline.length === 0 ? (
              <div className="text-center py-6 text-neutral-400 font-medium text-sm">
                No workflow history available.
              </div>
            ) : (
              <div className="relative pl-4 space-y-8 before:absolute before:inset-y-2 before:left-[7px] before:w-0.5 before:bg-neutral-100">
                {timeline.map((item, index) => {
                  const variant = getStatusVariant(item.status || item.action);
                  
                  // Dynamic colors for the timeline dots based on status
                  let dotClasses = "bg-neutral-300 ring-neutral-50";
                  if (variant === "success") dotClasses = "bg-emerald-500 ring-emerald-50";
                  else if (variant === "danger") dotClasses = "bg-rose-500 ring-rose-50";
                  else if (variant === "warning") dotClasses = "bg-amber-500 ring-amber-50";

                  return (
                    <div key={index} className="relative pl-6">
                      {/* Timeline Node */}
                      <span className={`absolute left-[-13px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ring-4 ${dotClasses}`} />
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                          <p className="font-bold text-neutral-900">
                            {item.level || item.step}
                          </p>
                          <p className="text-sm font-medium text-neutral-500 mt-0.5">
                            {item.action}
                          </p>
                          <p className="text-[11px] font-semibold tracking-wide text-neutral-400 mt-2 uppercase">
                            By: {item.by || item.actionByName || "System"} • {dayjs(item.date).format("DD MMM YYYY, hh:mm A")}
                          </p>
                        </div>
                        <Badge variant={variant}>
                          {item.status || item.action}
                        </Badge>
                      </div>

                      {item.remarks && (
                        <div className="mt-4 rounded-xl bg-neutral-50/80 border border-neutral-200/60 p-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                            Remarks
                          </p>
                          <p className="text-sm text-neutral-700 font-medium">{item.remarks}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* ====================================================== */}
          {/* REVIEWER REMARKS */}
          {/* ====================================================== */}
          {submission.permissions?.canApprove && (
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-neutral-800 text-base mb-3">Reviewer Remarks</h3>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter your remarks for approval, revision request, or rejection..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm font-medium text-neutral-800"
              />
            </div>
          )}
          
          {/* Bottom spacing padding */}
          <div className="h-4"></div>
        </div>

        {/* ====================================================== */}
        {/* FOOTER ACTIONS */}
        {/* ====================================================== */}
        <div className="shrink-0 bg-white border-t border-neutral-200/80 p-6 z-10">
          {submission.permissions?.canApprove ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ActionButton
                defaultText="Approve"
                activeText="Approved"
                icon={Check}
                className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl py-3 font-semibold"
                onClick={() => handleAction("Approve")}
              />
              <ActionButton
                defaultText="Request Revision"
                activeText="Revision Requested"
                icon={CornerUpLeft}
                variant="warning"
                className="rounded-xl py-3 font-semibold"
                onClick={() => handleAction("Request Revision")}
              />
              <ActionButton
                defaultText="Reject"
                activeText="Rejected"
                icon={XCircle}
                variant="danger"
                className="rounded-xl py-3 font-semibold"
                onClick={() => handleAction("Reject")}
              />
            </div>
          ) : (
            <div className="text-center bg-neutral-50 rounded-xl py-3 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border border-neutral-100">
              View Only Mode — Effective Approver: {submission.effectiveApprover?.label || 'Assigned Desk'}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReviewDrawer;