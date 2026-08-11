// import React, { useMemo, useState } from "react";
// import dayjs from "dayjs";
// import {
//   X,
//   Check,
//   CornerUpLeft,
//   XCircle,
//   User,
//   Building2,
//   BookOpen,
//   IndianRupee,
//   Clock,
//   ExternalLink,
//   Users,
// } from "lucide-react";

// import Badge from "../../../../components/Ui/Badge";
// import ActionButton from "../../../../shared/components/ActionButton";

// const ReviewDrawer = ({ submission, isOpen, onClose, onAction }) => {
//   const [remarks, setRemarks] = useState("");

//   if (!isOpen || !submission) return null;

//   const metadata =
//     submission.metadata ||
//     submission.fields ||
//     submission.publicationDetails ||
//     {};

//   const incentive = submission.incentiveInfo || {};
//   const history = submission.workflowHistory || [];

//   const timeline = useMemo(() => {
//     return [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [history]);

//   const handleAction = (action) => {
//     onAction(action, remarks);
//     setRemarks("");
//   };

//   const renderField = (label, value) => {
//     if (
//       value === undefined ||
//       value === null ||
//       value === "" ||
//       value === false
//     ) {
//       return null;
//     }

//     return (
//       <div className="border-b border-gray-100 py-3">
//         <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>

//         <p className="font-medium text-gray-900 break-all mt-1">
//           {String(value)}
//         </p>
//       </div>
//     );
//   };

//   const renderLink = (label, value) => {
//     if (!value) return null;

//     return (
//       <div className="border-b border-gray-100 py-3">
//         <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>

//         <a
//           href={value}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="mt-1 inline-flex items-center gap-2 text-blue-600 hover:underline break-all"
//         >
//           {value}
//           <ExternalLink size={14} />
//         </a>
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-50">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />

//       <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl overflow-y-auto">
//         {/* HEADER */}

//         <div className="sticky top-0 z-20 bg-white border-b px-6 py-5 flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-bold">Submission Review</h2>

//             <p className="text-sm text-gray-500 mt-1">
//               {submission.claimNumber || submission.id}
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 hover:bg-gray-100"
//           >
//             <X />
//           </button>
//         </div>

//         <div className="space-y-8 p-6">
//           {/* ====================================================== */}
//           {/* APPLICANT */}
//           {/* ====================================================== */}

//           <section>
//             <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
//               <User size={18} />
//               Applicant Information
//             </h3>

//             <div className="border rounded-xl p-5 grid md:grid-cols-2 gap-x-8">
//               {renderField("Applicant Name", submission.creatorName)}

//               {renderField("Department", submission.creatorDept)}

//               {renderField("Role", submission.creatorRole)}

//               {renderField(
//                 "Submission ID",
//                 submission.claimNumber || submission.id,
//               )}

//               {renderField(
//                 "Submitted On",
//                 dayjs(submission.dateSubmitted || submission.createdAt).format(
//                   "DD MMM YYYY",
//                 ),
//               )}

//               <div className="border-b border-gray-100 py-3">
//                 <p className="text-xs uppercase tracking-wide text-gray-500">
//                   Current Status
//                 </p>

//                 <div className="mt-2">
//                   <Badge variant="warning">{submission.status}</Badge>
//                 </div>
//               </div>

//               {renderField("Current Review Level", submission.currentLevel)}
//             </div>
//           </section>

//           {/* ====================================================== */}
//           {/* SUBMISSION */}
//           {/* ====================================================== */}

//           <section>
//             <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
//               <BookOpen size={18} />
//               Submission Details
//             </h3>

//             <div className="border rounded-xl p-5">
//               {renderField(
//                 "Submission Title",
//                 metadata.title || submission.title,
//               )}

//               {renderField("Research Category", submission.category)}

//               {renderField(
//                 "Submission Type",
//                 metadata.dropdown || submission.subtype,
//               )}

//               {renderField("Research Domain", metadata.domain)}
//             </div>
//           </section>

//           {/* ====================================================== */}
//           {/* VERIFICATION */}
//           {/* ====================================================== */}

//           <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
//             <Building2 size={18} />
//             Verification Details
//           </h3>

//           <div className="border rounded-xl p-5">
//             {/* ================= Publication ================= */}

//             {submission.subtype === "journal_publication" && (
//               <>
//                 {renderField("Name of Journal", metadata.journalName)}

//                 {renderField("Quartile", metadata.quartile)}

//                 {renderField("Impact Factor", metadata.impactFactor)}

//                 {renderField("Volume No.", metadata.volumeNo)}

//                 {renderField("Issue No.", metadata.issueNo)}

//                 {renderField("Page No.", metadata.pageNo)}

//                 {renderLink("Quartile Proof", metadata.quartileProof)}

//                 {renderLink("DOI", metadata.firstVerification)}

//                 {renderLink("Scopus Profile", metadata.secondVerification)}

//                 {renderLink("Publisher URL", metadata.thirdVerification)}

//                 {renderLink("Journal Website", metadata.fourthVerification)}
//               </>
//             )}

//             {/* ================= Books ================= */}

//             {(submission.subtype === "book" ||
//               submission.subtype === "book_chapter") && (
//               <>
//                 {renderField("Author / Editor", metadata.authorEditorName)}

//                 {renderField("Publisher", metadata.publisherName)}

//                 {renderField("Publication Year", metadata.publicationYear)}

//                 {renderField("Edition", metadata.edition)}

//                 {renderField("Chapter Details", metadata.chapterDetails)}

//                 {renderField("Page Count", metadata.pageCount)}

//                 {renderLink("ISBN", metadata.firstVerification)}

//                 {renderLink("Publisher Website", metadata.secondVerification)}

//                 {renderLink("Book Link", metadata.thirdVerification)}

//                 {renderLink("Indexing Link", metadata.fourthVerification)}
//               </>
//             )}

//             {/* ================= Patent ================= */}

//             {submission.subtype?.includes("patent") && (
//               <>
//                 {renderField("Inventor Details", metadata.inventorDetails)}

//                 {renderField("Application Number", metadata.applicationNumber)}

//                 {renderField("Patent Category", metadata.patentCategory)}

//                 {renderField("Technology Domain", metadata.technologyDomain)}

//                 {renderField("Filing Date", metadata.filingDate)}

//                 {renderField("Grant Date", metadata.grantDate)}

//                 {renderLink("Patent Number", metadata.firstVerification)}

//                 {renderLink("Patent Office", metadata.secondVerification)}

//                 {renderLink("Filing Link", metadata.thirdVerification)}

//                 {renderLink("Verification URL", metadata.fourthVerification)}
//               </>
//             )}
//             {/* Research Details */}

//             <section>
//               <h3 className="font-semibold text-lg flex gap-2 items-center mb-3">
//                 <BookOpen size={18} />
//                 Research Details
//               </h3>

//               <div className="border rounded-xl p-5 space-y-5">
//                 <div className="grid md:grid-cols-2 gap-5">
//                   <div>
//                     <p className="text-xs uppercase text-gray-500 mb-1">
//                       Submission Type
//                     </p>

//                     <p className="font-medium">{submission.category || "-"}</p>
//                   </div>

//                   <div>
//                     <p className="text-xs uppercase text-gray-500 mb-1">
//                       Form Type
//                     </p>

//                     <p className="font-medium">
//                       {metadata.dropdown || submission.subtype || "-"}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xs uppercase text-gray-500 mb-1">Title</p>

//                   <p className="font-medium">
//                     {submission.title || metadata.title || "-"}
//                   </p>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-5">
//                   <div>
//                     <p className="text-xs uppercase text-gray-500 mb-1">
//                       Research Domain
//                     </p>

//                     <p className="font-medium">{metadata.domain || "-"}</p>
//                   </div>

//                   <div>
//                     <p className="text-xs uppercase text-gray-500 mb-1">
//                       Quartile
//                     </p>

//                     <Badge
//                       variant={
//                         metadata.quartile === "Q1"
//                           ? "success"
//                           : metadata.quartile === "Q2"
//                             ? "warning"
//                             : "default"
//                       }
//                     >
//                       {metadata.quartile || "N/A"}
//                     </Badge>
//                   </div>
//                 </div>

//                 {metadata.impactFactor && (
//                   <div>
//                     <p className="text-xs uppercase text-gray-500 mb-1">
//                       Impact Factor
//                     </p>

//                     <p className="font-medium">{metadata.impactFactor}</p>
//                   </div>
//                 )}

//                 {metadata.authors?.length > 0 && (
//                   <div>
//                     <p className="text-xs uppercase text-gray-500 mb-3">
//                       Authors
//                     </p>

//                     <div className="flex flex-wrap gap-2">
//                       {metadata.authors.map((author, index) => (
//                         <span
//                           key={author.id || index}
//                           className="px-3 py-1 rounded-full bg-gray-100 text-sm"
//                         >
//                           {author.name}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* Verification */}

//             <section>
//               <h3 className="font-semibold text-lg flex gap-2 items-center mb-3">
//                 <Building2 size={18} />
//                 Verification Details
//               </h3>

//               <div className="border rounded-xl p-5 grid md:grid-cols-2 gap-5">
//                 {metadata.firstVerification && (
//                   <div>
//                     <p className="text-xs uppercase text-gray-500">
//                       DOI / ISBN / Patent No.
//                     </p>

//                     <a
//                       href={metadata.firstVerification}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 break-all hover:underline"
//                     >
//                       {metadata.firstVerification}
//                     </a>
//                   </div>
//                 )}

//                 {metadata.secondVerification && (
//                   <div>
//                     <p className="text-xs uppercase text-gray-500">
//                       Scopus / Publisher
//                     </p>

//                     <a
//                       href={metadata.secondVerification}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 break-all hover:underline"
//                     >
//                       {metadata.secondVerification}
//                     </a>
//                   </div>
//                 )}

//                 {metadata.thirdVerification && (
//                   <div>
//                     <p className="text-xs uppercase text-gray-500">
//                       Verification Link
//                     </p>

//                     <a
//                       href={metadata.thirdVerification}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 break-all hover:underline"
//                     >
//                       {metadata.thirdVerification}
//                     </a>
//                   </div>
//                 )}

//                 {metadata.fourthVerification && (
//                   <div>
//                     <p className="text-xs uppercase text-gray-500">
//                       Additional Link
//                     </p>

//                     <a
//                       href={metadata.fourthVerification}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-blue-600 break-all hover:underline"
//                     >
//                       {metadata.fourthVerification}
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* Incentive Evaluation */}

//             <section>
//               <h3 className="font-semibold text-lg flex gap-2 items-center mb-3">
//                 <IndianRupee size={18} />
//                 Incentive Evaluation
//               </h3>

//               <div className="border rounded-xl p-5">
//                 <div className="grid md:grid-cols-3 gap-5">
//                   <div>
//                     <p className="text-xs uppercase text-gray-500">Quartile</p>

//                     <Badge variant="success">{metadata.quartile || "-"}</Badge>
//                   </div>

//                   <div>
//                     <p className="text-xs uppercase text-gray-500">
//                       Estimated Incentive
//                     </p>

//                     <p className="font-semibold text-lg">
//                       ₹{incentive.estimatedAmount ?? "Pending"}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-xs uppercase text-gray-500">
//                       Eligibility
//                     </p>

//                     <p className="font-medium">
//                       {incentive.eligibleIncentive || "Pending Evaluation"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </section>
//             {/* Workflow Timeline */}

//             <section>
//               <h3 className="font-semibold text-lg flex gap-2 items-center mb-3">
//                 <Clock size={18} />
//                 Workflow Timeline
//               </h3>

//               <div className="space-y-4">
//                 {timeline.length === 0 && (
//                   <div className="border rounded-xl p-4 text-center text-gray-500">
//                     No workflow history available.
//                   </div>
//                 )}

//                 {timeline.map((item, index) => (
//                   <div key={index} className="border rounded-xl p-4 bg-gray-50">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-semibold">
//                           {item.level || item.step}
//                         </p>

//                         <p className="text-sm text-gray-600 mt-1">
//                           {item.action}
//                         </p>
//                       </div>

//                       <Badge variant="default">
//                         {item.status || item.action}
//                       </Badge>
//                     </div>

//                     <div className="mt-3 text-sm">
//                       <p>
//                         <strong>Reviewed By:</strong>{" "}
//                         {item.by || item.actionByName || "System"}
//                       </p>

//                       <p className="text-gray-500 mt-1">
//                         {dayjs(item.date).format("DD MMM YYYY • hh:mm A")}
//                       </p>

//                       {item.remarks && (
//                         <div className="mt-3 rounded-lg bg-white border p-3">
//                           <p className="text-xs uppercase text-gray-500 mb-1">
//                             Remarks
//                           </p>

//                           <p>{item.remarks}</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Reviewer Remarks */}
//             {submission.permissions?.canApprove && (
//               <section>
//                 <h3 className="font-semibold mb-3">Reviewer Remarks</h3>

//                 <textarea
//                   rows={4}
//                   value={remarks}
//                   onChange={(e) => setRemarks(e.target.value)}
//                   placeholder="Enter remarks for approval, revision request, or rejection..."
//                   className="w-full border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-black text-sm"
//                 />
//               </section>
//             )}
//           </div>

//           {/* Footer */}
//           {submission.permissions?.canApprove ? (
//             <div className="sticky bottom-0 bg-white border-t px-6 py-5">
//               <div className="grid grid-cols-3 gap-3">
//                 <ActionButton
//                   defaultText="Approve"
//                   activeText="Approved"
//                   icon={Check}
//                   className="bg-black text-white"
//                   onClick={() => handleAction("Approve")}
//                 />

//                 <ActionButton
//                   defaultText="Request Revision"
//                   activeText="Revision Requested"
//                   icon={CornerUpLeft}
//                   variant="warning"
//                   onClick={() => handleAction("Request Revision")}
//                 />

//                 <ActionButton
//                   defaultText="Reject"
//                   activeText="Rejected"
//                   icon={XCircle}
//                   variant="danger"
//                   onClick={() => handleAction("Reject")}
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
//               View Only Mode — Effective Approver: {submission.effectiveApprover?.label || 'Assigned Desk'}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewDrawer;
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

const ReviewDrawer = ({ submission, isOpen, onClose, onAction }) => {
  const [remarks, setRemarks] = useState("");

  if (!isOpen || !submission) return null;

  const metadata =
    submission.metadata ||
    submission.fields ||
    submission.publicationDetails ||
    {};

  const incentive = submission.incentiveInfo || {};
  const history = submission.workflowHistory || [];

  const timeline = useMemo(() => {
    return [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [history]);

  const handleAction = (action) => {
    onAction(action, remarks);
    setRemarks("");
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
              <Badge variant="warning">{submission.status}</Badge>
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
                  {renderField("Presentation Status", metadata.presentationStatus)}
                  {renderField("Type of Author(s)", metadata.authorType)}
                  {renderField("Indexing Tier", metadata.indexingTier)}
                  {renderField("Organised By", metadata.organizedBy)}
                  {renderField("Conference Start Date", metadata.startDate)}
                  {renderField("Conference End Date", metadata.endDate)}
                  {renderField("Venue / Location", metadata.venue)}
                </>
              )}

              {/* Books */}
              {(submission.subtype === "book" || submission.subtype === "book_chapter" || submission.subtype === "book_section") && (
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
                {timeline.map((item, index) => (
                  <div key={index} className="relative pl-6">
                    {/* Timeline Node */}
                    <span className="absolute left-[-13px] top-1 h-3.5 w-3.5 rounded-full bg-neutral-300 border-2 border-white ring-4 ring-neutral-50" />
                    
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
                      <Badge variant="default">{item.status || item.action}</Badge>
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
                ))}
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