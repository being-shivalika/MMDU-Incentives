import { transporter, EMAIL_FROM } from '../config/emailConfig.js';
import EmailLog from '../models/EmailLog.js';
import logger from '../utils/logger.js';

/**
 * Send an email and log the result.
 * Never throws — email failures should not break the workflow.
 */
const sendEmail = async ({ to, subject, html, claimId, type }) => {
  const emailLog = await EmailLog.create({
    to,
    subject,
    claim: claimId || null,
    type: type || 'general',
    status: 'pending'
  });
  
  try {
    if (!transporter) {
      logger.warn(`Email not configured. Would have sent to ${to}: ${subject}`);
      emailLog.status = 'failed';
      emailLog.error = 'SMTP not configured';
      await emailLog.save();
      return;
    }
    
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html
    });
    
    emailLog.status = 'sent';
    emailLog.sentAt = new Date();
    await emailLog.save();
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    emailLog.status = 'failed';
    emailLog.error = error.message;
    await emailLog.save();
    logger.error(`Failed to send email to ${to}: ${error.message}`);
  }
};

/**
 * Build a standard claim status email.
 */
const buildClaimEmailHtml = ({ claimNumber, title, currentStage, statusText, remarks, actionBy, completedStages, pendingStages, additionalInfo }) => {
  const completedHtml = (completedStages || []).map(s => `✅ ${s}`).join(' → ');
  const pendingHtml = (pendingStages || []).map(s => `⬜ ${s}`).join(' → ');
  
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
        <h2 style="margin: 0; font-size: 18px;">📋 RPMS Notification</h2>
        <p style="margin: 8px 0 0; opacity: 0.8; font-size: 14px;">Research Promotion Management System</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Claim Number</td><td style="padding: 8px 0; font-weight: 600;">${claimNumber}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Title</td><td style="padding: 8px 0;">${title}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Current Stage</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb;">${currentStage}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Status</td><td style="padding: 8px 0;">${statusText}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Date/Time</td><td style="padding: 8px 0;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
          ${actionBy ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Action By</td><td style="padding: 8px 0;">${actionBy}</td></tr>` : ''}
          ${remarks ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Remarks</td><td style="padding: 8px 0; font-style: italic;">${remarks}</td></tr>` : ''}
        </table>
        
        ${completedHtml || pendingHtml ? `
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <p style="margin: 0 0 8px; font-weight: 600; font-size: 13px; color: #374151;">Workflow Progress:</p>
          <p style="margin: 0; font-size: 13px;">${completedHtml}${completedHtml && pendingHtml ? ' → ' : ''}${pendingHtml}</p>
        </div>
        ` : ''}
        
        ${additionalInfo ? `<div style="margin-top: 16px; padding: 12px; background: #fef3c7; border-radius: 8px; font-size: 13px;">${additionalInfo}</div>` : ''}
        
        <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">Please log in to the <a href="#" style="color: #2563eb;">RPMS Portal</a> to view details.</p>
      </div>
    </div>
  `;
};

// ═══════════ Public API ═══════════

/**
 * Notify applicant that claim was submitted.
 */
export const sendClaimSubmittedEmail = async (claim, applicantEmail) => {
  const html = buildClaimEmailHtml({
    claimNumber: claim.claimNumber,
    title: claim.title,
    currentStage: 'Department Review (HOD)',
    statusText: 'Submitted for review',
    completedStages: ['Faculty'],
    pendingStages: ['HOD', 'Principal', 'RPC', 'Accounts']
  });
  await sendEmail({ to: applicantEmail, subject: `[RPMS] Claim ${claim.claimNumber} — Submitted Successfully`, html, claimId: claim._id, type: 'submission' });
};

/**
 * Notify applicant and previous approver that claim was forwarded.
 */
export const sendClaimForwardedEmail = async (claim, applicantEmail, previousApproverEmail, { actionByName, currentStage, completedStages, pendingStages, remarks }) => {
  // Email to applicant
  const applicantHtml = buildClaimEmailHtml({
    claimNumber: claim.claimNumber,
    title: claim.title,
    currentStage,
    statusText: 'Approved and forwarded',
    actionBy: actionByName,
    remarks,
    completedStages,
    pendingStages
  });
  await sendEmail({ to: applicantEmail, subject: `[RPMS] Claim ${claim.claimNumber} — Approved by ${actionByName}`, html: applicantHtml, claimId: claim._id, type: 'approval' });
  
  // Email to previous approver (confirmation)
  if (previousApproverEmail) {
    const approverHtml = buildClaimEmailHtml({
      claimNumber: claim.claimNumber,
      title: claim.title,
      currentStage,
      statusText: 'Your approval has been processed. The claim has moved to the next stage.',
      completedStages,
      pendingStages
    });
    await sendEmail({ to: previousApproverEmail, subject: `[RPMS] Claim ${claim.claimNumber} — Your Approval Processed`, html: approverHtml, claimId: claim._id, type: 'approval_confirmation' });
  }
};

/**
 * Notify applicant and previous approver about rejection.
 * Rejection reason is mandatory.
 */
export const sendClaimRejectedEmail = async (claim, applicantEmail, previousApproverEmail, { rejectedByName, rejectedByRole, rejectionReason, currentStatus, nextAction }) => {
  const html = buildClaimEmailHtml({
    claimNumber: claim.claimNumber,
    title: claim.title,
    currentStage: 'Rejected',
    statusText: `Rejected by ${rejectedByName} (${rejectedByRole})`,
    actionBy: rejectedByName,
    remarks: rejectionReason,
    additionalInfo: `<strong>Next Required Action:</strong> ${nextAction || 'Please review and resubmit if applicable.'}`
  });
  await sendEmail({ to: applicantEmail, subject: `[RPMS] Claim ${claim.claimNumber} — Rejected by ${rejectedByName}`, html, claimId: claim._id, type: 'rejection' });
  
  if (previousApproverEmail) {
    const approverHtml = buildClaimEmailHtml({
      claimNumber: claim.claimNumber,
      title: claim.title,
      currentStage: 'Rejected',
      statusText: `This claim has been rejected by ${rejectedByName}.`,
      remarks: rejectionReason
    });
    await sendEmail({ to: previousApproverEmail, subject: `[RPMS] Claim ${claim.claimNumber} — Rejected`, html: approverHtml, claimId: claim._id, type: 'rejection_notification' });
  }
};

/**
 * Notify applicant that claim was returned for correction.
 */
export const sendClaimReturnedEmail = async (claim, applicantEmail, { returnedByName, remarks }) => {
  const html = buildClaimEmailHtml({
    claimNumber: claim.claimNumber,
    title: claim.title,
    currentStage: 'Returned for Correction',
    statusText: 'Returned by ' + returnedByName,
    actionBy: returnedByName,
    remarks,
    additionalInfo: 'Please review the remarks, make corrections, and resubmit your claim.'
  });
  await sendEmail({ to: applicantEmail, subject: `[RPMS] Claim ${claim.claimNumber} — Returned for Correction`, html, claimId: claim._id, type: 'return' });
};

/**
 * Notify applicant about payment release.
 */
export const sendPaymentReleasedEmail = async (claim, applicantEmail, { amount, transactionId }) => {
  const html = buildClaimEmailHtml({
    claimNumber: claim.claimNumber,
    title: claim.title,
    currentStage: 'Payment Released',
    statusText: 'Incentive payment has been processed',
    additionalInfo: `<strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}<br><strong>Transaction ID:</strong> ${transactionId}`
  });
  await sendEmail({ to: applicantEmail, subject: `[RPMS] Claim ${claim.claimNumber} — Payment Released ₹${amount.toLocaleString('en-IN')}`, html, claimId: claim._id, type: 'payment' });
};

/**
 * Notify applicant about payment completion (UTR confirmed).
 */
export const sendPaymentCompletedEmail = async (claim, applicantEmail, { amount, utrNumber, paymentDate }) => {
  const html = buildClaimEmailHtml({
    claimNumber: claim.claimNumber,
    title: claim.title,
    currentStage: 'Completed',
    statusText: 'Payment credited to your account',
    additionalInfo: `<strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}<br><strong>UTR Number:</strong> ${utrNumber}<br><strong>Payment Date:</strong> ${new Date(paymentDate).toLocaleDateString('en-IN')}`
  });
  await sendEmail({ to: applicantEmail, subject: `[RPMS] Claim ${claim.claimNumber} — Payment Completed ₹${amount.toLocaleString('en-IN')}`, html, claimId: claim._id, type: 'payment_completed' });
};
