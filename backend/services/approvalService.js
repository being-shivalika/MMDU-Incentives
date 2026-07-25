import Claim from '../models/Claim.js';
import ApprovalHistory from '../models/ApprovalHistory.js';
import User from '../models/User.js';
import * as workflowConfigService from './workflowConfigService.js';
import * as policyEngine from './policyEngine.js';
import * as researchScoreService from './researchScoreService.js';
import * as transactionService from './transactionService.js';
import * as notificationService from './notificationService.js';
import * as emailService from './emailService.js';
import { createAuditLog } from './auditService.js';
import { AUDIT_ACTIONS } from '../constants/auditActions.js';
import { CLAIM_STATUSES } from '../constants/claimStatuses.js';
import { NOTIFICATION_TYPES } from '../constants/notificationTypes.js';
import logger from '../utils/logger.js';

/**
 * Build workflow progress object for frontend consumption.
 * @param {Object} claim
 * @param {Array} approvalHistory
 * @returns {Object} workflowProgress
 */
export const buildWorkflowProgress = async (claim, approvalHistory = []) => {
  try {
    const orderedStages = await workflowConfigService.getOrderedStages();
    const stageLabels = orderedStages.map(s => s.shortLabel);
    const totalSteps = stageLabels.length;
    
    const isRejected = claim.status === CLAIM_STATUSES.REJECTED;
    const isReturned = claim.status === CLAIM_STATUSES.RETURNED;
    const isCompleted = claim.status === CLAIM_STATUSES.COMPLETED;
    
    // Find current stage index
    let currentStageIndex = orderedStages.findIndex(s => s.stageKey === claim.status);
    
    // Handle special states
    if (isCompleted) currentStageIndex = totalSteps; // Past all stages
    if (isRejected || isReturned) {
      // Find the last stage that had an action in approval history
      const lastApproval = [...approvalHistory].reverse().find(h => 
        orderedStages.some(s => s.stageKey === h.fromStatus)
      );
      if (lastApproval) {
        currentStageIndex = orderedStages.findIndex(s => s.stageKey === lastApproval.fromStatus);
      }
    }
    
    const currentStep = Math.min(currentStageIndex + 1, totalSteps);
    const percentage = isCompleted ? 100 : Math.round((currentStep / totalSteps) * 100);
    
    // Determine completed vs pending
    const completedStages = stageLabels.slice(0, currentStageIndex);
    const pendingStages = isCompleted ? [] : stageLabels.slice(currentStageIndex);
    
    let statusLabel = 'Under Review';
    if (isCompleted) statusLabel = 'Completed & Disbursed';
    else if (isRejected) statusLabel = 'Rejected';
    else if (isReturned) statusLabel = 'Returned for Correction';
    else if (claim.status === CLAIM_STATUSES.DRAFT) statusLabel = 'Draft';
    
    const currentStage = currentStageIndex >= 0 && currentStageIndex < totalSteps
      ? stageLabels[currentStageIndex]
      : (isCompleted ? 'Completed' : claim.status);
    
    return {
      currentStage,
      currentStep,
      totalSteps,
      percentage,
      statusLabel,
      isRejected,
      isReturned,
      completedStages,
      pendingStages
    };
  } catch (error) {
    logger.error('Failed to build workflow progress:', error.message);
    return {
      currentStage: claim.status,
      currentStep: 0,
      totalSteps: 0,
      percentage: 0,
      statusLabel: claim.status,
      isRejected: false,
      isReturned: false,
      completedStages: [],
      pendingStages: []
    };
  }
};

/**
 * Process a workflow transition.
 * This is the MAIN entry point for all approval/rejection/return actions.
 */
export const processTransition = async (submissionId, actionType, user, comment, incentiveAmount, ipAddress) => {
  // 1. Load claim
  const claim = await Claim.findById(submissionId);
  if (!claim) {
    const error = new Error('Claim not found');
    error.statusCode = 404;
    throw error;
  }
  
  const currentStatus = claim.status;
  
  // 2. Get stage config — check if it's a regular stage, returned state, or unknown
  let stageConfig = await workflowConfigService.getStageConfig(currentStatus);
  
  if (!stageConfig) {
    const error = new Error(`No workflow configuration found for status '${currentStatus}'`);
    error.statusCode = 400;
    throw error;
  }
  
  // 3. Validate user role matches required role
  if (stageConfig.requiredRole && stageConfig.requiredRole !== user.role) {
    // Also allow admin to perform any action
    if (user.role !== 'admin') {
      const error = new Error(`Role '${user.role}' is not authorized to act on claims in '${currentStatus}' status. Required: '${stageConfig.requiredRole}'`);
      error.statusCode = 403;
      throw error;
    }
  }
  
  // 4. Find action definition
  const actionDef = (stageConfig.allowedActions || []).find(a => a.type === actionType);
  if (!actionDef) {
    const error = new Error(`Action '${actionType}' is not allowed in status '${currentStatus}'`);
    error.statusCode = 400;
    throw error;
  }
  
  // 5. MANDATORY rejection reason
  if (actionDef.isTerminal && !actionDef.isForward) {
    // This is a rejection
    if (!comment || comment.trim() === '') {
      const error = new Error('Rejection reason is mandatory and cannot be empty');
      error.statusCode = 400;
      throw error;
    }
  }
  // Also check for RETURN actions
  if (!actionDef.isForward && !actionDef.isTerminal) {
    if (!comment || comment.trim() === '') {
      const error = new Error('Remarks are required when returning a claim');
      error.statusCode = 400;
      throw error;
    }
  }
  
  // 6. Determine target status
  let targetStatus;
  if (actionDef.targetStage) {
    targetStatus = actionDef.targetStage;
  } else if (actionDef.isTerminal) {
    targetStatus = actionType.includes('REJECT') || actionType.includes('WITHDRAW') 
      ? CLAIM_STATUSES.REJECTED 
      : CLAIM_STATUSES.COMPLETED;
  } else if (actionDef.isForward) {
    const nextStage = await workflowConfigService.getNextStage(currentStatus);
    targetStatus = nextStage ? nextStage.stageKey : CLAIM_STATUSES.COMPLETED;
  } else {
    // Return/backward
    targetStatus = CLAIM_STATUSES.RETURNED;
  }
  
  // 7. Determine the new desk holder
  const targetStageConfig = await workflowConfigService.getStageConfig(targetStatus);
  const newDesk = targetStageConfig?.requiredRole || null;
  
  // 8. Determine step name for history
  const stepName = getStepName(actionType, user.role);
  const actionLabel = actionDef.isForward ? 'approved' : 
                     (actionDef.isTerminal ? 'rejected' : 'returned');
  
  // === SPECIAL ACTIONS ===
  
  // Policy calculation on APPROVE_INCENTIVE
  if (actionType === 'APPROVE_INCENTIVE') {
    const policyResult = await policyEngine.calculateIncentive(claim);
    claim.calculatedAmount = policyResult.amount;
    claim.approvedAmount = incentiveAmount || policyResult.amount;
    claim.policySnapshot = policyResult.policySnapshot;
    claim.researchScore = policyResult.scorePoints;
    
    // Store research score
    await researchScoreService.calculateAndStoreScore(claim, policyResult);
    
    await createAuditLog({
      action: AUDIT_ACTIONS.AMOUNT_CALCULATED,
      entity: 'Claim',
      entityId: claim._id,
      performedBy: user._id,
      details: { calculatedAmount: policyResult.amount, approvedAmount: claim.approvedAmount, policySnapshot: policyResult.policySnapshot },
      ipAddress
    });
  }
  
  // Transaction creation on RELEASE_PAYMENT
  if (actionType === 'RELEASE_PAYMENT') {
    const amount = incentiveAmount || claim.approvedAmount || claim.calculatedAmount;
    claim.releasedAmount = amount;
    
    const transaction = await transactionService.releasePayment(claim, amount, user._id, comment);
    claim.paymentDetails = {
      transactionId: transaction.voucherNumber,
      dateReleased: new Date().toISOString(),
      remarks: comment || 'Incentive released.'
    };
  }
  
  // 9. Update claim
  claim.status = targetStatus;
  claim.currentDesk = newDesk;
  
  // 10. Build and store workflow progress
  const approvalHistory = await ApprovalHistory.find({ claim: claim._id }).sort({ date: 1 });
  claim.workflowProgress = await buildWorkflowProgress(claim, approvalHistory);
  
  await claim.save();
  
  // 11. Create immutable ApprovalHistory record
  await ApprovalHistory.create({
    claim: claim._id,
    step: stepName,
    action: actionType,
    fromStatus: currentStatus,
    toStatus: targetStatus,
    actionBy: user._id,
    actionByName: user.name,
    actionByRole: user.role,
    remarks: comment || '',
    date: new Date()
  });
  
  // 12. Audit log
  const auditAction = actionDef.isForward ? AUDIT_ACTIONS.CLAIM_APPROVED :
                      actionDef.isTerminal ? AUDIT_ACTIONS.CLAIM_REJECTED :
                      AUDIT_ACTIONS.CLAIM_RETURNED;
  await createAuditLog({
    action: auditAction,
    entity: 'Claim',
    entityId: claim._id,
    performedBy: user._id,
    details: { fromStatus: currentStatus, toStatus: targetStatus, actionType, remarks: comment },
    ipAddress
  });
  
  // 13. DB Notifications
  await generateNotifications(claim, actionType, actionDef, user, comment);
  
  // 14. Email Notifications
  await generateEmails(claim, actionType, actionDef, user, comment);
  
  // 15. Re-fetch with full history and return
  const updatedClaim = await Claim.findById(claim._id);
  const fullHistory = await ApprovalHistory.find({ claim: claim._id }).sort({ date: 1 });
  
  // Re-compute workflow progress with updated history
  updatedClaim.workflowProgress = await buildWorkflowProgress(updatedClaim, fullHistory);
  await updatedClaim.save();
  
  return { claim: updatedClaim, approvalHistory: fullHistory };
};

/**
 * Generate step name from action and role.
 */
const getStepName = (actionType, role) => {
  const roleLabels = {
    faculty: 'Faculty', student: 'Student', hod: 'HOD',
    principal: 'Principal', director: 'Director/RPC',
    rd_cell: 'R&D Cell', rpc_cell: 'RPC Cell',
    accounts: 'Accounts', registrar: 'Registrar',
    vc: 'Vice Chancellor', admin: 'Admin'
  };
  const roleLabel = roleLabels[role] || role;
  
  if (actionType.includes('SUBMIT') || actionType.includes('RESUBMIT')) return 'Submitted';
  if (actionType.includes('REJECT') || actionType.includes('WITHDRAW')) return `Rejected by ${roleLabel}`;
  if (actionType.includes('RETURN')) return `Returned by ${roleLabel}`;
  if (actionType.includes('RELEASE_PAYMENT')) return 'Payment Released';
  if (actionType.includes('APPROVE') || actionType.includes('FORWARD') || actionType.includes('VERIFY')) {
    return `${roleLabel} Review`;
  }
  return `${roleLabel} Action`;
};

/**
 * Generate DB notifications for a workflow transition.
 */
const generateNotifications = async (claim, actionType, actionDef, actingUser, comment) => {
  try {
    // Always notify the applicant
    const applicant = await User.findById(claim.applicant);
    if (applicant && applicant._id.toString() !== actingUser._id.toString()) {
      let type, title, message;
      
      if (actionDef.isForward) {
        type = NOTIFICATION_TYPES.CLAIM_FORWARDED;
        title = `Claim ${claim.claimNumber} — Approved`;
        message = `Your claim "${claim.title}" has been approved by ${actingUser.name} and forwarded to the next stage.`;
      } else if (actionDef.isTerminal) {
        type = NOTIFICATION_TYPES.CLAIM_REJECTED;
        title = `Claim ${claim.claimNumber} — Rejected`;
        message = `Your claim "${claim.title}" has been rejected by ${actingUser.name}. Reason: ${comment}`;
      } else {
        type = NOTIFICATION_TYPES.CLAIM_RETURNED;
        title = `Claim ${claim.claimNumber} — Returned for Correction`;
        message = `Your claim "${claim.title}" has been returned by ${actingUser.name}. Remarks: ${comment}`;
      }
      
      await notificationService.createNotification({
        recipient: applicant._id,
        sender: actingUser._id,
        senderRole: actingUser.role,
        type,
        title,
        message,
        claim: claim._id,
        redirectUrl: `/applicant/submissions/${claim._id}`
      });
    }
    
    // Notify next reviewer if forwarded
    if (actionDef.isForward && claim.currentDesk) {
      const nextReviewers = await notificationService.findUsersByRole(
        claim.currentDesk,
        claim.currentDesk === 'hod' ? claim.department : null
      );
      for (const reviewer of nextReviewers) {
        await notificationService.createNotification({
          recipient: reviewer._id,
          sender: actingUser._id,
          senderRole: actingUser.role,
          type: NOTIFICATION_TYPES.CLAIM_FORWARDED,
          title: `New Claim in Queue — ${claim.claimNumber}`,
          message: `Claim "${claim.title}" by ${claim.applicantName} requires your review.`,
          claim: claim._id,
          redirectUrl: getReviewUrl(claim.currentDesk, claim._id)
        });
      }
    }
  } catch (error) {
    logger.error('Failed to generate notifications:', error.message);
  }
};

/**
 * Generate email notifications for a workflow transition.
 */
const generateEmails = async (claim, actionType, actionDef, actingUser, comment) => {
  try {
    const applicant = await User.findById(claim.applicant);
    if (!applicant) return;
    
    const progress = claim.workflowProgress || {};
    
    if (actionType === 'SUBMIT_CLAIM' || actionType === 'RESUBMIT_CLAIM') {
      await emailService.sendClaimSubmittedEmail(claim, applicant.email);
    } else if (actionType === 'RELEASE_PAYMENT') {
      await emailService.sendPaymentReleasedEmail(claim, applicant.email, {
        amount: claim.releasedAmount,
        transactionId: claim.paymentDetails?.transactionId || 'N/A'
      });
    } else if (actionDef.isForward) {
      await emailService.sendClaimForwardedEmail(claim, applicant.email, actingUser.email, {
        actionByName: actingUser.name,
        currentStage: progress.currentStage || claim.status,
        completedStages: progress.completedStages || [],
        pendingStages: progress.pendingStages || [],
        remarks: comment
      });
    } else if (actionDef.isTerminal) {
      await emailService.sendClaimRejectedEmail(claim, applicant.email, null, {
        rejectedByName: actingUser.name,
        rejectedByRole: actingUser.role,
        rejectionReason: comment,
        currentStatus: claim.status,
        nextAction: 'Please review and resubmit if applicable.'
      });
    } else {
      // Return
      await emailService.sendClaimReturnedEmail(claim, applicant.email, {
        returnedByName: actingUser.name,
        remarks: comment
      });
    }
  } catch (error) {
    logger.error('Failed to send workflow emails:', error.message);
  }
};

/**
 * Get the appropriate review URL for a role.
 */
const getReviewUrl = (role, claimId) => {
  const urlMap = {
    hod: `/department-review/submission/${claimId}`,
    principal: `/department-review/submission/${claimId}`,
    director: `/research-review/submission/${claimId}`,
    rd_cell: `/research-review/submission/${claimId}`,
    rpc_cell: `/research-review/submission/${claimId}`,
    accounts: `/accounts/submission/${claimId}`,
    registrar: `/registrar/submission/${claimId}`
  };
  return urlMap[role] || `/submissions/${claimId}`;
};
