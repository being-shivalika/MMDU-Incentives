import Claim from '../models/Claim.js';
import ApprovalHistory from '../models/ApprovalHistory.js';
import User from '../models/User.js';
import * as workflowConfigService from './workflowConfigService.js';
import * as policyEngine from './policyEngine.js';
import * as researchScoreService from './researchScoreService.js';
import * as transactionService from './transactionService.js';
import * as notificationService from './notificationService.js';
import * as emailService from './emailService.js';
import { getEffectiveApprover, getClaimPermissions } from './hierarchyService.js';
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
    const effectiveApprover = await getEffectiveApprover(claim.department, claim.institute);
    
    const isRejected = claim.status === CLAIM_STATUSES.REJECTED;
    const isReturned = claim.status === CLAIM_STATUSES.RETURNED;
    const isCompleted = claim.status === CLAIM_STATUSES.COMPLETED;
    
    const isEligiblePayout = (claim.totalIncentive > 0 || claim.approvedAmount > 0 || claim.calculatedAmount > 0) && !claim.isHeld;
    const finalStepLabel = isEligiblePayout ? 'Account Credited Money' : 'Completed';
    const firstStepLabel = claim.applicantRole === 'student' ? 'Student' : 'Faculty';
    
    const isMca = String(claim.department || '').toLowerCase().includes('mca') || String(claim.department || '').toLowerCase().includes('computer applications');
    const hasHod = effectiveApprover.role === 'hod' && !isMca;

    let stepsConfig = [];
    if (hasHod) {
      stepsConfig = [
        { id: 'DRAFT', key: 'DRAFT', label: firstStepLabel, role: 'faculty' },
        { id: 'DEPARTMENT_REVIEW', key: 'DEPARTMENT_REVIEW', label: 'HOD Review', role: 'hod' },
        { id: 'PRINCIPAL_REVIEW', key: 'PRINCIPAL_REVIEW', label: 'Principal Review', role: 'principal' },
        { id: 'RPC_VERIFICATION', key: 'RPC_VERIFICATION', label: 'R & D Cell', role: 'rpc_cell' },
        { id: 'ACCOUNTS_PROCESSING', key: 'ACCOUNTS_PROCESSING', label: 'Finance & Accounts', role: 'accounts' },
        { id: 'COMPLETED', key: 'COMPLETED', label: finalStepLabel, role: 'accounts' }
      ];
    } else {
      stepsConfig = [
        { id: 'DRAFT', key: 'DRAFT', label: firstStepLabel, role: 'faculty' },
        { id: 'DEPARTMENT_REVIEW', key: 'DEPARTMENT_REVIEW', label: 'Principal Direct Review', role: 'principal' },
        { id: 'RPC_VERIFICATION', key: 'RPC_VERIFICATION', label: 'R & D Cell', role: 'rpc_cell' },
        { id: 'ACCOUNTS_PROCESSING', key: 'ACCOUNTS_PROCESSING', label: 'Finance & Accounts', role: 'accounts' },
        { id: 'COMPLETED', key: 'COMPLETED', label: finalStepLabel, role: 'accounts' }
      ];
    }

    const totalSteps = stepsConfig.length;
    let activeIndex = stepsConfig.findIndex(s => s.key === claim.status);

    if (isCompleted) activeIndex = totalSteps - 1;
    if (isRejected || isReturned) {
      const lastHistory = [...approvalHistory].reverse().find(h => h.fromStatus && h.fromStatus !== 'NEW');
      if (lastHistory) {
        const foundIdx = stepsConfig.findIndex(s => s.key === lastHistory.fromStatus);
        if (foundIdx >= 0) activeIndex = foundIdx;
      }
    }
    if (activeIndex < 0) activeIndex = 0;

    const currentStep = activeIndex + 1;
    const percentage = isCompleted ? 100 : Math.round((currentStep / totalSteps) * 100);

    const steps = stepsConfig.map((s, idx) => {
      let stepStatus = 'pending';
      if (isCompleted || idx < activeIndex) stepStatus = 'completed';
      else if (idx === activeIndex) {
        if (isRejected) stepStatus = 'rejected';
        else if (isReturned) stepStatus = 'returned';
        else stepStatus = 'active';
      }

      const historyMatch = [...approvalHistory].reverse().find(h => h.toStatus === s.key || h.fromStatus === s.key);
      return {
        ...s,
        status: stepStatus,
        actionDate: historyMatch ? historyMatch.date : null,
        actorName: historyMatch ? historyMatch.actionByName : null
      };
    });

    let statusLabel = 'Under Review';
    if (isCompleted) statusLabel = 'Completed & Disbursed';
    else if (isRejected) statusLabel = 'Rejected';
    else if (isReturned) statusLabel = 'Returned for Correction';
    else if (claim.status === CLAIM_STATUSES.DRAFT) statusLabel = 'Draft';

    return {
      currentStage: stepsConfig[activeIndex]?.label || claim.status,
      currentStep,
      totalSteps,
      percentage,
      statusLabel,
      isRejected,
      isReturned,
      effectiveApproverRole: effectiveApprover.role,
      effectiveApproverLabel: effectiveApprover.label,
      isFallbackRouting: effectiveApprover.isFallback,
      fallbackReason: effectiveApprover.fallbackReason,
      completedStages: steps.filter(s => s.status === 'completed').map(s => s.label),
      pendingStages: steps.filter(s => s.status === 'pending').map(s => s.label),
      steps
    };
  } catch (error) {
    logger.error('Failed to build workflow progress:', error.message);
    return {
      currentStage: claim.status,
      currentStep: 0,
      totalSteps: 5,
      percentage: 0,
      statusLabel: claim.status,
      isRejected: false,
      isReturned: false,
      steps: []
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
  
  // 2. Validate permissions dynamically based on effective approver hierarchy
  const permissions = await getClaimPermissions(claim, user);
  const genericAction = (actionType || '').toLowerCase().trim();
  const isForwardAction = genericAction.includes('approve') || genericAction.includes('submit') || genericAction.includes('forward') || genericAction.includes('release');
  const isRejectAction = genericAction.includes('reject') || genericAction.includes('withdraw');
  const isReturnAction = genericAction.includes('return') || genericAction.includes('revision');

  if (['accounts', 'admin'].includes(user.role)) {
    permissions.canReleasePayment = true;
    permissions.canConfirmPayment = true;
  }

  if (isForwardAction && !permissions.canApprove && !permissions.canReleasePayment && !permissions.canSubmit) {
    const error = new Error(`User with role '${user.role}' is not the effective approver for stage '${claim.status}'.`);
    error.statusCode = 403;
    throw error;
  }

  if (isRejectAction && !permissions.canReject) {
    const error = new Error(`User with role '${user.role}' is not authorized to reject claim in stage '${claim.status}'.`);
    error.statusCode = 403;
    throw error;
  }

  if (isReturnAction && !permissions.canReturn) {
    const error = new Error(`User with role '${user.role}' is not authorized to return claim in stage '${claim.status}'.`);
    error.statusCode = 403;
    throw error;
  }
  
  const currentStatus = claim.status;
  
  // 3. Get stage config
  let stageConfig = await workflowConfigService.getStageConfig(currentStatus);
  if (!stageConfig) {
    stageConfig = {
      stageKey: currentStatus,
      allowedActions: [
        { type: 'approve', isForward: true, isTerminal: false },
        { type: 'reject', isForward: false, isTerminal: true, targetStage: CLAIM_STATUSES.REJECTED },
        { type: 'return', isForward: false, isTerminal: false, targetStage: CLAIM_STATUSES.RETURNED }
      ]
    };
  }
  
  // 4. Find action definition
  let actualActionType = actionType;
  let actionDef = (stageConfig.allowedActions || []).find(a => a.type === actualActionType);
  
  if (!actionDef) {
    if (isForwardAction) {
      actionDef = (stageConfig.allowedActions || []).find(a => a.isForward);
    } else if (isRejectAction) {
      actionDef = (stageConfig.allowedActions || []).find(a => a.isTerminal && !a.isForward);
    } else if (isReturnAction) {
      actionDef = (stageConfig.allowedActions || []).find(a => !a.isForward && !a.isTerminal);
    }
    
    if (actionDef) {
      actualActionType = actionDef.type;
    }
  }

  if (!actionDef) {
    actionDef = { type: actionType, isForward: isForwardAction, isTerminal: isRejectAction, targetStage: isRejectAction ? CLAIM_STATUSES.REJECTED : isReturnAction ? CLAIM_STATUSES.RETURNED : CLAIM_STATUSES.COMPLETED };
    actualActionType = actionType;
  }
  
  // 5. MANDATORY rejection / return remarks check
  if (actionDef.isTerminal && !actionDef.isForward) {
    if (!comment || comment.trim() === '') {
      const error = new Error('Rejection reason is mandatory and cannot be empty');
      error.statusCode = 400;
      throw error;
    }
  }

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
    targetStatus = isRejectAction ? CLAIM_STATUSES.REJECTED : CLAIM_STATUSES.COMPLETED;
  } else if (actionDef.isForward) {
    const nextStage = await workflowConfigService.getNextStage(currentStatus);
    targetStatus = nextStage ? nextStage.stageKey : CLAIM_STATUSES.COMPLETED;
  } else {
    targetStatus = CLAIM_STATUSES.RETURNED;
  }
  
  // 7. Determine the new desk holder
  const targetStageConfig = await workflowConfigService.getStageConfig(targetStatus);
  let newDesk = targetStageConfig?.requiredRole || null;
  if (targetStatus === 'RPC_VERIFICATION') newDesk = 'rpc_cell';
  if (targetStatus === 'ACCOUNTS_PROCESSING') newDesk = 'accounts';
  if (targetStatus === 'DEPARTMENT_REVIEW') newDesk = 'hod';
  
  // 8. Step name
  const stepName = getStepName(actualActionType, user.role);
  
  // === SPECIAL ACTIONS: Policy Calculation & Second Publication Payment Rule ===
  
  // Calculate policy and author split when forwarding to/from RPC
  if (actualActionType === 'APPROVE_INCENTIVE' || targetStatus === 'ACCOUNTS_PROCESSING' || currentStatus === 'RPC_VERIFICATION') {
    const policyResult = await policyEngine.calculateIncentive(claim);
    
    claim.totalIncentive = policyResult.totalIncentive || policyResult.amount;
    claim.mmduAuthorCount = policyResult.mmduAuthorCount || 1;
    claim.individualShare = policyResult.individualShare || policyResult.amount;
    claim.authorPayments = policyResult.authorPayments || [];
    claim.calculatedAmount = policyResult.amount;
    claim.approvedAmount = incentiveAmount || policyResult.amount;
    claim.policySnapshot = policyResult.policySnapshot;
    claim.researchScore = policyResult.scorePoints;

    // Q1, Q2 and eligible publications give incentive from 1st submission
    claim.isHeld = false;
    claim.heldReason = null;
    if (claim.authorPayments && claim.authorPayments.length > 0) {
      claim.authorPayments.forEach(p => { p.paymentStatus = 'READY_FOR_RELEASE'; });
    }
    
    await researchScoreService.calculateAndStoreScore(claim, policyResult);
    
    await createAuditLog({
      action: AUDIT_ACTIONS.AMOUNT_CALCULATED,
      entity: 'Claim',
      entityId: claim._id,
      performedBy: user._id,
      details: {
        totalIncentive: claim.totalIncentive,
        individualShare: claim.individualShare,
        mmduAuthorCount: claim.mmduAuthorCount,
        isHeld: claim.isHeld
      },
      ipAddress
    });
  }
  
  // Transaction creation on RELEASE_PAYMENT
  if (actualActionType === 'RELEASE_PAYMENT' || (currentStatus === 'ACCOUNTS_PROCESSING' && isForwardAction)) {
    const amount = incentiveAmount || claim.individualShare || claim.approvedAmount || claim.calculatedAmount;
    claim.releasedAmount = amount;
    claim.paidAmount = amount;
    claim.isPaid = true;
    claim.paymentStatus = 'PAID';
    
    if (claim.authorPayments && claim.authorPayments.length > 0) {
      claim.authorPayments.forEach(p => {
        if (p.isMmdu) p.paymentStatus = 'PAID';
      });
    }

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
  
  // 10. Build workflow progress
  const approvalHistory = await ApprovalHistory.find({ claim: claim._id }).sort({ date: 1 });
  claim.workflowProgress = await buildWorkflowProgress(claim, approvalHistory);
  
  await claim.save();
  
  // 11. Create immutable ApprovalHistory record
  await ApprovalHistory.create({
    claim: claim._id,
    step: stepName,
    action: actualActionType,
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
    details: { fromStatus: currentStatus, toStatus: targetStatus, actionType: actualActionType, remarks: comment },
    ipAddress
  });
  
  // 13. DB Notifications
  await generateNotifications(claim, actualActionType, actionDef, user, comment);
  
  // 14. Email Notifications
  await generateEmails(claim, actualActionType, actionDef, user, comment);
  
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
