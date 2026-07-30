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
      <div className="border-b border-gray-100 py-3">
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>

        <p className="font-medium text-gray-900 break-all mt-1">
          {String(value)}
        </p>
      </div>
    );
  };

  const renderLink = (label, value) => {
    if (!value) return null;

    return (
      <div className="border-b border-gray-100 py-3">
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>

        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-2 text-blue-600 hover:underline break-all"
        >
          {value}
          <ExternalLink size={14} />
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl overflow-y-auto">
        {/* HEADER */}

        <div className="sticky top-0 z-20 bg-white border-b px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Submission Review</h2>

            <p className="text-sm text-gray-500 mt-1">
              {submission.claimNumber || submission.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        <div className="space-y-8 p-6">
          {/* ====================================================== */}
          {/* APPLICANT */}
          {/* ====================================================== */}

          <section>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <User size={18} />
              Applicant Information
            </h3>

            <div className="border rounded-xl p-5 grid md:grid-cols-2 gap-x-8">
              {renderField("Applicant Name", submission.creatorName)}

              {renderField("Department", submission.creatorDept)}

              {renderField("Role", submission.creatorRole)}

              {renderField(
                "Submission ID",
                submission.claimNumber || submission.id,
              )}

              {renderField(
                "Submitted On",
                dayjs(submission.dateSubmitted || submission.createdAt).format(
                  "DD MMM YYYY",
                ),
              )}

              <div className="border-b border-gray-100 py-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Current Status
                </p>

                <div className="mt-2">
                  <Badge variant="warning">{submission.status}</Badge>
                </div>
              </div>

              {renderField("Current Review Level", submission.currentLevel)}
            </div>
          </section>

          {/* ====================================================== */}
          {/* SUBMISSION */}
          {/* ====================================================== */}

          <section>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <BookOpen size={18} />
              Submission Details
            </h3>

            <div className="border rounded-xl p-5">
              {renderField(
                "Submission Title",
                metadata.title || submission.title,
              )}

              {renderField("Research Category", submission.category)}

              {renderField(
                "Submission Type",
                metadata.dropdown || submission.subtype,
              )}

              {renderField("Research Domain", metadata.domain)}
            </div>
          </section>

          {/* ====================================================== */}
          {/* VERIFICATION */}
          {/* ====================================================== */}

          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Building2 size={18} />
            Verification Details
          </h3>

          <div className="border rounded-xl p-5">
            {/* ================= Publication ================= */}

            {submission.subtype === "journal_publication" && (
              <>
                {renderField("Quartile", metadata.quartile)}

                {renderField("Impact Factor", metadata.impactFactor)}

                {renderLink("DOI", metadata.firstVerification)}

                {renderLink("Scopus Profile", metadata.secondVerification)}

                {renderLink("Publisher URL", metadata.thirdVerification)}

                {renderLink("Journal Website", metadata.fourthVerification)}
              </>
            )}

            {/* ================= Books ================= */}

            {(submission.subtype === "book" ||
              submission.subtype === "book_chapter") && (
              <>
                {renderField("Author / Editor", metadata.authorEditorName)}

                {renderField("Publisher", metadata.publisherName)}

                {renderField("Publication Year", metadata.publicationYear)}

                {renderField("Edition", metadata.edition)}

                {renderField("Chapter Details", metadata.chapterDetails)}

                {renderField("Page Count", metadata.pageCount)}

                {renderLink("ISBN", metadata.firstVerification)}

                {renderLink("Publisher Website", metadata.secondVerification)}

                {renderLink("Book Link", metadata.thirdVerification)}

                {renderLink("Indexing Link", metadata.fourthVerification)}
              </>
            )}

            {/* ================= Patent ================= */}

            {submission.subtype?.includes("patent") && (
              <>
                {renderField("Inventor Details", metadata.inventorDetails)}

                {renderField("Application Number", metadata.applicationNumber)}

                {renderField("Patent Category", metadata.patentCategory)}

                {renderField("Technology Domain", metadata.technologyDomain)}

                {renderField("Filing Date", metadata.filingDate)}

                {renderField("Grant Date", metadata.grantDate)}

                {renderLink("Patent Number", metadata.firstVerification)}

                {renderLink("Patent Office", metadata.secondVerification)}

                {renderLink("Filing Link", metadata.thirdVerification)}

                {renderLink("Verification URL", metadata.fourthVerification)}
              </>
            )}
            {/* Research Details */}

            <section>
              <h3 className="font-semibold text-lg flex gap-2 items-center mb-3">
                <BookOpen size={18} />
                Research Details
              </h3>

              <div className="border rounded-xl p-5 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">
                      Submission Type
                    </p>

                    <p className="font-medium">{submission.category || "-"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">
                      Form Type
                    </p>

                    <p className="font-medium">
                      {metadata.dropdown || submission.subtype || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Title</p>

                  <p className="font-medium">
                    {submission.title || metadata.title || "-"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">
                      Research Domain
                    </p>

                    <p className="font-medium">{metadata.domain || "-"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">
                      Quartile
                    </p>

                    <Badge
                      variant={
                        metadata.quartile === "Q1"
                          ? "success"
                          : metadata.quartile === "Q2"
                            ? "warning"
                            : "default"
                      }
                    >
                      {metadata.quartile || "N/A"}
                    </Badge>
                  </div>
                </div>

                {metadata.impactFactor && (
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-1">
                      Impact Factor
                    </p>

                    <p className="font-medium">{metadata.impactFactor}</p>
                  </div>
                )}

                {metadata.authors?.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-gray-500 mb-3">
                      Authors
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {metadata.authors.map((author, index) => (
                        <span
                          key={author.id || index}
                          className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                        >
                          {author.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Verification */}

            <section>
              <h3 className="font-semibold text-lg flex gap-2 items-center mb-3">
                <Building2 size={18} />
                Verification Details
              </h3>

              <div className="border rounded-xl p-5 grid md:grid-cols-2 gap-5">
                {metadata.firstVerification && (
                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      DOI / ISBN / Patent No.
                    </p>

                    <a
                      href={metadata.firstVerification}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 break-all hover:underline"
                    >
                      {metadata.firstVerification}
                    </a>
                  </div>
                )}

                {metadata.secondVerification && (
                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Scopus / Publisher
                    </p>

                    <a
                      href={metadata.secondVerification}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 break-all hover:underline"
                    >
                      {metadata.secondVerification}
                    </a>
                  </div>
                )}

                {metadata.thirdVerification && (
                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Verification Link
                    </p>

                    <a
                      href={metadata.thirdVerification}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 break-all hover:underline"
                    >
                      {metadata.thirdVerification}
                    </a>
                  </div>
                )}

                {metadata.fourthVerification && (
                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Additional Link
                    </p>

                    <a
                      href={metadata.fourthVerification}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 break-all hover:underline"
                    >
                      {metadata.fourthVerification}
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Incentive Evaluation */}

            <section>
              <h3 className="font-semibold text-lg flex gap-2 items-center mb-3">
                <IndianRupee size={18} />
                Incentive Evaluation
              </h3>

              <div className="border rounded-xl p-5">
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Quartile</p>

                    <Badge variant="success">{metadata.quartile || "-"}</Badge>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Estimated Incentive
                    </p>

                    <p className="font-semibold text-lg">
                      ₹{incentive.estimatedAmount ?? "Pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Eligibility
                    </p>

                    <p className="font-medium">
                      {incentive.eligibleIncentive || "Pending Evaluation"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            {/* Workflow Timeline */}

            <section>
              <h3 className="font-semibold text-lg flex gap-2 items-center mb-3">
                <Clock size={18} />
                Workflow Timeline
              </h3>

              <div className="space-y-4">
                {timeline.length === 0 && (
                  <div className="border rounded-xl p-4 text-center text-gray-500">
                    No workflow history available.
                  </div>
                )}

                {timeline.map((item, index) => (
                  <div key={index} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {item.level || item.step}
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          {item.action}
                        </p>
                      </div>

                      <Badge variant="default">
                        {item.status || item.action}
                      </Badge>
                    </div>

                    <div className="mt-3 text-sm">
                      <p>
                        <strong>Reviewed By:</strong>{" "}
                        {item.by || item.actionByName || "System"}
                      </p>

                      <p className="text-gray-500 mt-1">
                        {dayjs(item.date).format("DD MMM YYYY • hh:mm A")}
                      </p>

                      {item.remarks && (
                        <div className="mt-3 rounded-lg bg-white border p-3">
                          <p className="text-xs uppercase text-gray-500 mb-1">
                            Remarks
                          </p>

                          <p>{item.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviewer Remarks */}
            {submission.permissions?.canApprove && (
              <section>
                <h3 className="font-semibold mb-3">Reviewer Remarks</h3>

                <textarea
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks for approval, revision request, or rejection..."
                  className="w-full border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
              </section>
            )}
          </div>

          {/* Footer */}
          {submission.permissions?.canApprove ? (
            <div className="sticky bottom-0 bg-white border-t px-6 py-5">
              <div className="grid grid-cols-3 gap-3">
                <ActionButton
                  defaultText="Approve"
                  activeText="Approved"
                  icon={Check}
                  className="bg-black text-white"
                  onClick={() => handleAction("Approve")}
                />

                <ActionButton
                  defaultText="Request Revision"
                  activeText="Revision Requested"
                  icon={CornerUpLeft}
                  variant="warning"
                  onClick={() => handleAction("Request Revision")}
                />

                <ActionButton
                  defaultText="Reject"
                  activeText="Rejected"
                  icon={XCircle}
                  variant="danger"
                  onClick={() => handleAction("Reject")}
                />
              </div>
            </div>
          ) : (
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              View Only Mode — Effective Approver: {submission.effectiveApprover?.label || 'Assigned Desk'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDrawer;
