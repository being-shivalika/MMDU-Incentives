import React from "react";
import { CheckCircle2, Clock, XCircle, RotateCcw, AlertTriangle, Activity } from "lucide-react";
import dayjs from "dayjs";

/**
 * Standardized Unified Workflow Progress Component
 * Single reusable workflow file used across ALL dashboards and submission details pages.
 */
const WorkflowProgressTracker = ({ 
  submission, 
  workflowProgress, 
  isHeld: propIsHeld, 
  heldReason: propHeldReason, 
  title = "Workflow Progress"
}) => {
  const sub = submission || {};
  if (!sub || Object.keys(sub).length === 0) return null;

  const isHeld = propIsHeld !== undefined ? propIsHeld : sub.isHeld;
  const heldReason = propHeldReason || sub.heldReason;

  const ost = String(sub.originalStatus || sub.status || '').toUpperCase();
  const st = String(sub.status || '').toUpperCase();

  const isPaid = Boolean(
    sub.isPaid || 
    sub.paymentStatus === 'PAID' || 
    ost === 'COMPLETED' || 
    st === 'COMPLETED' || 
    st.includes('DISBURSED') || 
    st.includes('PAID')
  );

  const isAccountsPending = (ost === 'ACCOUNTS_PROCESSING' || sub.isAccountsApproved) && !isPaid;
  const isRpcPending = (ost === 'RPC_VERIFICATION' || ost === 'PRINCIPAL_REVIEW') && !isAccountsPending && !isPaid;
  const isDeptPending = ost === 'DEPARTMENT_REVIEW' && !isRpcPending && !isAccountsPending && !isPaid;
  const isRejected = ost === 'REJECTED' || st.includes('REJECT');
  const isReturned = ost === 'RETURNED' || st.includes('RETURN') || st.includes('REVISION');

  const deptStr = String(sub.creatorDept || sub.department || '').toLowerCase();
  const isMcaDept = deptStr.includes('mca') || deptStr.includes('computer applications');

  const createdDate = sub.submittedAt || sub.dateSubmitted || sub.createdAt 
    ? dayjs(sub.submittedAt || sub.dateSubmitted || sub.createdAt).format("DD MMM YYYY, HH:mm")
    : dayjs().format("DD MMM YYYY, HH:mm");

  const updatedDate = sub.updatedAt 
    ? dayjs(sub.updatedAt).format("DD MMM YYYY, HH:mm")
    : createdDate;

  // Synthesize standard 4 workflow steps
  const steps = [
    {
      key: 'FACULTY',
      title: sub.applicantRole === 'student' ? 'Student Submission' : 'Faculty Submission',
      action: 'Submitted',
      by: `${sub.creatorName || sub.submittedBy || 'Applicant'}`,
      date: createdDate,
      badge: 'Submitted',
      badgeStyle: 'bg-neutral-50 text-neutral-700 border-neutral-300',
      dotStyle: 'bg-emerald-500'
    },
    {
      key: 'HOD',
      title: isMcaDept ? 'Principal Direct Review' : 'HOD Review',
      action: isDeptPending ? (isRejected ? 'Rejected' : isReturned ? 'Revision Requested' : 'Under Review') : 'Approved & Forwarded',
      by: isMcaDept ? 'Principal Office' : 'Department HOD',
      date: isDeptPending ? updatedDate : createdDate,
      badge: isDeptPending ? (isRejected ? 'Rejected' : isReturned ? 'Returned' : 'Pending Review') : 'Approved',
      badgeStyle: isDeptPending 
        ? (isRejected ? 'bg-red-50 text-red-700 border-red-200' : isReturned ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-amber-50 text-amber-700 border-amber-200')
        : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotStyle: isDeptPending ? (isRejected ? 'bg-red-500' : isReturned ? 'bg-orange-500' : 'bg-amber-500 animate-pulse') : 'bg-emerald-500'
    },
    {
      key: 'RPC',
      title: 'R & D Verification',
      action: isRpcPending ? (isRejected ? 'Rejected' : isReturned ? 'Revision Requested' : 'Under Verification') : (isAccountsPending || isPaid ? 'Verified & Forwarded' : 'Pending Verification'),
      by: 'RPC / R&D Cell',
      date: isRpcPending ? updatedDate : (isAccountsPending || isPaid ? updatedDate : '—'),
      badge: isRpcPending 
        ? (isRejected ? 'Rejected' : isReturned ? 'Returned' : 'Pending Verification')
        : (isAccountsPending || isPaid ? 'Verified' : 'Pending'),
      badgeStyle: isRpcPending 
        ? (isRejected ? 'bg-red-50 text-red-700 border-red-200' : isReturned ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-amber-50 text-amber-700 border-amber-200')
        : (isAccountsPending || isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-neutral-100 text-neutral-500 border-neutral-200'),
      dotStyle: isRpcPending 
        ? (isRejected ? 'bg-red-500' : isReturned ? 'bg-orange-500' : 'bg-amber-500 animate-pulse')
        : (isAccountsPending || isPaid ? 'bg-emerald-500' : 'bg-neutral-300')
    },
    {
      key: 'ACCOUNTS',
      title: 'Accounts Disbursement',
      action: isPaid ? 'Incentive Released & Bank Credited' : (isAccountsPending ? 'Disbursement Pending' : 'Awaiting R&D Approval'),
      by: 'Accounts Office',
      date: isPaid || isAccountsPending ? updatedDate : '—',
      badge: isPaid ? 'Disbursed & Paid' : (isAccountsPending ? 'Pending Accounts Review' : 'Pending'),
      badgeStyle: isPaid 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold'
        : (isAccountsPending ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-neutral-100 text-neutral-500 border-neutral-200'),
      dotStyle: isPaid 
        ? 'bg-emerald-500 ring-4 ring-emerald-100'
        : (isAccountsPending ? 'bg-amber-500 animate-pulse ring-4 ring-amber-100' : 'bg-neutral-300')
    }
  ];

  const overallStatusLabel = isPaid 
    ? "Approved & Disbursed" 
    : (isAccountsPending 
      ? "Pending Accounts Review" 
      : (isRpcPending 
        ? "Pending R & D Review" 
        : (isDeptPending 
          ? (isMcaDept ? "Pending Principal Review" : "Pending HOD Review") 
          : (isRejected ? "Rejected" : isReturned ? "Revision Requested" : "Under Review"))));

  const overallBadgeStyle = isPaid 
    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
    : (isRejected 
      ? "bg-red-50 text-red-700 border-red-200" 
      : (isReturned 
        ? "bg-orange-50 text-orange-700 border-orange-200" 
        : "bg-amber-50 text-amber-800 border-amber-200"));

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm text-left space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#8C0404]" /> {title}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Claim #: <span className="font-mono font-bold text-neutral-800">{sub.claimNumber || sub.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${overallBadgeStyle}`}>
            {overallStatusLabel}
          </span>
        </div>
      </div>

      {/* Held Payment Notice */}
      {isHeld && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Second Publication Rule Active:</span> {heldReason || "Payment held until second eligible publication per policy."}
          </div>
        </div>
      )}

      {/* Vertical Step Timeline (Exact match with attached image style) */}
      <div className="relative space-y-6 pt-2">
        {/* Continuous Vertical Line - Perfectly aligned at center 7px */}
        <div className="absolute top-3 bottom-3 left-[7px] w-0.5 bg-neutral-200 -translate-x-1/2"></div>

        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-start justify-between gap-4 pl-6">
            {/* Timeline Dot - 14px width starting at left 0px, center is 7px */}
            <div className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${step.dotStyle}`}></div>

            <div className="space-y-0.5 flex-1">
              <p className="text-xs font-bold text-neutral-900">
                {step.title}
              </p>
              <p className="text-xs font-medium text-neutral-600">
                {step.action}
              </p>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                BY: {step.by} {step.date !== '—' ? `• ${step.date}` : ''}
              </p>
            </div>

            <div className="shrink-0">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${step.badgeStyle}`}>
                {step.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgressTracker;
