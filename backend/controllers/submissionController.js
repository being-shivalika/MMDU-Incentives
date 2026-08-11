import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import * as claimService from '../services/claimService.js';
import * as approvalService from '../services/approvalService.js';
import { getClaimPermissions, getEffectiveApprover } from '../services/hierarchyService.js';
import ApprovalHistory from '../models/ApprovalHistory.js';
import Claim from '../models/Claim.js';

/**
 * @desc List claims with filtering and pagination
 * @route GET /api/submissions
 * @access Private
 */
export const listSubmissions = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    category: req.query.category,
    creatorId: req.query.creatorId,
    department: req.query.department,
    financialYear: req.query.financialYear,
    search: req.query.search,
    sortBy: req.query.sortBy,
    order: req.query.order
  };
  const pagination = {
    page: req.query.page,
    limit: req.query.limit
  };
  
  const result = await claimService.listClaims(filters, pagination, req.user);
  
  // Transform claims for frontend compatibility
  const data = await Promise.all(result.claims.map(claim => transformClaimForResponse(claim, null, req.user)));
  
  return successResponse(res, 'Claims retrieved successfully', data);
});

/**
 * @desc Create a new claim
 * @route POST /api/submissions
 * @access Private (faculty, student)
 */
export const createSubmission = asyncHandler(async (req, res) => {
  const claim = await claimService.createClaim(req.body, req.user, req.ip);
  
  // Build workflow progress for the new claim
  const approvalHistory = await ApprovalHistory.find({ claim: claim._id }).sort({ date: 1 });
  claim.workflowProgress = await approvalService.buildWorkflowProgress(claim, approvalHistory);
  await claim.save();
  
  const data = await transformClaimForResponse(claim, approvalHistory, req.user);
  return successResponse(res, 'Claim created successfully', data, 201);
});

/**
 * @desc Get a single submission with full approval history
 * @route GET /api/submissions/:id
 * @access Private
 */
export const getSubmission = asyncHandler(async (req, res) => {
  const { claim, approvalHistory } = await claimService.getClaimById(req.params.id);
  const data = await transformClaimForResponse(claim, approvalHistory, req.user);
  return successResponse(res, 'Claim retrieved successfully', data);
});

/**
 * @desc Update a claim (only in DRAFT or RETURNED)
 * @route PUT /api/submissions/:id
 * @access Private (faculty, student)
 */
export const updateSubmission = asyncHandler(async (req, res) => {
  const claim = await claimService.updateClaim(req.params.id, req.body, req.user, req.ip);
  
  // Rebuild workflow progress
  const approvalHistory = await ApprovalHistory.find({ claim: claim._id }).sort({ date: 1 });
  claim.workflowProgress = await approvalService.buildWorkflowProgress(claim, approvalHistory);
  await claim.save();
  
  const data = await transformClaimForResponse(claim, approvalHistory, req.user);
  return successResponse(res, 'Claim updated successfully', data);
});

/**
 * @desc Save as draft
 * @route PUT /api/submissions/:id/draft
 * @access Private (faculty, student)
 */
export const saveDraft = asyncHandler(async (req, res) => {
  const claim = await claimService.saveDraft(req.params.id, req.body, req.user);
  const data = await transformClaimForResponse(claim, null, req.user);
  return successResponse(res, 'Draft saved successfully', data);
});

/**
 * @desc Delete a draft claim
 * @route DELETE /api/submissions/:id
 * @access Private (faculty, student)
 */
export const deleteSubmission = asyncHandler(async (req, res) => {
  await claimService.deleteDraft(req.params.id, req.user);
  return successResponse(res, 'Draft deleted successfully', null);
});

/**
 * Transform a claim document into frontend-compatible response format.
 * Maps MongoDB _id to id, aliases metadata as fields, includes approvalHistory and dynamic permissions.
 */
const transformClaimForResponse = async (claim, approvalHistory = null, user = null) => {
  const claimObj = claim.toJSON ? claim.toJSON() : claim;
  const permissions = user ? await getClaimPermissions(claimObj, user) : { canEdit: claimObj.status === 'DRAFT' || claimObj.status === 'RETURNED' };
  const effectiveApprover = await getEffectiveApprover(claimObj.department, claimObj.institute);

  // Mapping currentDesk to currentLevel
  let currentLevel = 'Applicant';
  if (claimObj.currentDesk === 'rpc_cell' || claimObj.currentDesk === 'rpc' || claimObj.currentDesk === 'rd_cell' || claimObj.status === 'RPC_VERIFICATION') currentLevel = 'R & D';
  else if (claimObj.currentDesk === 'hod' || claimObj.currentDesk === 'principal' || claimObj.status === 'DEPARTMENT_REVIEW') currentLevel = effectiveApprover.role === 'principal' ? 'Principal' : 'HOD';
  else if (claimObj.currentDesk === 'director') currentLevel = 'Director';
  else if (claimObj.currentDesk === 'accounts' || claimObj.status === 'ACCOUNTS_PROCESSING') currentLevel = 'Accounts';
  else if (claimObj.status === 'COMPLETED') currentLevel = 'Completed';
  else if (claimObj.status === 'REJECTED') currentLevel = 'Applicant';
  
  // Mapping status to frontend string
  let frontendStatus = `Pending ${currentLevel} Review`;
  if (claimObj.status === 'COMPLETED') frontendStatus = 'Approved';
  else if (claimObj.status === 'REJECTED') frontendStatus = 'Rejected';
  else if (claimObj.status === 'RETURNED') frontendStatus = 'Revision Requested';
  else if (claimObj.status === 'DRAFT') frontendStatus = 'Draft';
  
  // Mapping reviews
  const reviews = { hod: null, principal: null, director: null, rpc: null, accounts: null };
  if (approvalHistory) {
    const sorted = [...approvalHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    ['hod', 'principal', 'director', 'rpc', 'accounts'].forEach(role => {
      const lastAction = sorted.find(h => h.actionByRole === role || (h.actionByRole && h.actionByRole.includes(role)));
      if (lastAction) {
        reviews[role] = {
          action: lastAction.action.includes('REJECT') ? 'Rejected' : lastAction.action.includes('RETURN') ? 'Revision Requested' : 'Approved',
          remarks: lastAction.remarks,
          by: lastAction.actionByName,
          date: lastAction.date
        };
      }
    });
  }

  // Find user's own individual share from authorPayments if applicable
  let userShare = claimObj.individualShare || claimObj.approvedAmount || claimObj.calculatedAmount || 0;
  if (user && claimObj.authorPayments && claimObj.authorPayments.length > 0) {
    const matchedAuthor = claimObj.authorPayments.find(a => 
      (user.employeeId && a.employeeId === user.employeeId) || 
      (user.name && a.name && a.name.toLowerCase().includes(user.name.toLowerCase()))
    );
    if (matchedAuthor) {
      userShare = matchedAuthor.payableAmount;
    }
  }

  return {
    id: claimObj.id || claimObj._id,
    claimNumber: claimObj.claimNumber,
    title: claimObj.title,
    category: claimObj.category,
    subtype: claimObj.subtype,
    status: frontendStatus,
    originalStatus: claimObj.status,
    currentLevel: currentLevel,
    department: claimObj.department,
    creatorId: claimObj.applicant,
    creatorName: claimObj.applicantName,
    creatorDept: claimObj.department,
    creatorRole: claimObj.applicantRole,
    dateSubmitted: claimObj.submissionDate || claimObj.createdAt,
    financialYear: claimObj.financialYear,
    incentiveAmount: userShare,
    totalIncentive: claimObj.totalIncentive || claimObj.approvedAmount || claimObj.calculatedAmount || 0,
    mmduAuthorCount: claimObj.mmduAuthorCount || 1,
    individualShare: claimObj.individualShare || claimObj.approvedAmount || claimObj.calculatedAmount || 0,
    userShare: userShare,
    authorPayments: claimObj.authorPayments || [],
    isHeld: claimObj.isHeld || false,
    heldReason: claimObj.heldReason || null,
    isAccountsApproved: claimObj.isAccountsApproved || claimObj.paymentStatus === 'APPROVED_BY_ACCOUNTS' || claimObj.paymentStatus === 'READY_FOR_RELEASE' || claimObj.status === 'COMPLETED' || claimObj.isPaid || false,
    isPaid: claimObj.isPaid || claimObj.paymentStatus === 'PAID' || false,
    paymentStatus: claimObj.isPaid || claimObj.paymentStatus === 'PAID' ? 'PAID' : (claimObj.isAccountsApproved || claimObj.paymentStatus === 'APPROVED_BY_ACCOUNTS' ? 'APPROVED_BY_ACCOUNTS' : (claimObj.paymentStatus || 'UNPAID')),
    calculatedAmount: claimObj.calculatedAmount,
    approvedAmount: claimObj.approvedAmount,
    releasedAmount: claimObj.releasedAmount,
    paidAmount: claimObj.paidAmount,
    currency: claimObj.currency || 'INR',
    researchScore: claimObj.researchScore,
    fields: claimObj.metadata || {},
    metadata: claimObj.metadata || {},
    workflowProgress: claimObj.workflowProgress || null,
    effectiveApprover,
    permissions,
    
    workflowHistory: (() => {
      if (!approvalHistory || !Array.isArray(approvalHistory)) return [];

      // Filter out draft actions (drafts are not workflow steps)
      const validHistory = approvalHistory.filter(
        (h) => h.action !== "SAVE_DRAFT" && h.step !== "Draft Saved"
      );

      const result = [];
      let hasSubmitted = false;

      validHistory.forEach((h) => {
        const isSubmitAction =
          h.action &&
          (h.action.includes("SUBMIT") || h.action === "SAVE_DRAFT");

        if (isSubmitAction) {
          if (hasSubmitted) return; // Allow only 1 initial submission entry for applicant
          hasSubmitted = true;
        }

        const role = (h.actionByRole || "").toLowerCase();
        let levelLabel = "Faculty";

        if (role === "hod") {
          levelLabel = "HOD";
        } else if (role === "principal") {
          levelLabel = "Principal";
        } else if (role === "director") {
          levelLabel = "Director";
        } else if (role === "rpc_cell" || role === "rd_cell" || role === "rpc") {
          levelLabel = "R & D";
        } else if (role === "accounts" || role === "finance") {
          const hasPayout =
            (claimObj.totalIncentive > 0 ||
              claimObj.approvedAmount > 0 ||
              userShare > 0) &&
            !claimObj.isHeld &&
            (claimObj.status === "COMPLETED" ||
              (h.action && h.action.includes("RELEASE")));
          levelLabel = hasPayout ? "Account Credited The Money" : "Completed";
        } else {
          levelLabel = claimObj.applicantRole === "student" ? "Student" : "Faculty";
        }

        const isRejected =
          h.action && (h.action.includes("REJECT") || h.action.includes("WITHDRAW"));
        const isReturned =
          h.action &&
          (h.action.includes("RETURN") ||
            h.action.includes("REVISE") ||
            h.action.includes("CORRECT"));
        const actionText = isRejected
          ? "Rejected"
          : isReturned
          ? "Revision Requested"
          : isSubmitAction
          ? "Submitted"
          : "Approved";

        result.push({
          level: levelLabel,
          action: actionText,
          isRejected,
          isReturned,
          by: h.actionByName,
          remarks: h.remarks,
          date: h.date,
        });
      });

      return result;
    })(),
    reviewHistory: approvalHistory 
      ? approvalHistory.map(h => ({
          step: h.step,
          status: h.action.includes('REJECT') ? 'rejected' : 
                  h.action.includes('RETURN') ? 'returned' : 'completed',
          actionBy: h.actionBy,
          actionByName: h.actionByName,
          remarks: h.remarks,
          date: h.date
        }))
      : [],
    reviews: reviews,
    generalInfo: {
      title: claimObj.title,
      submissionType: claimObj.subtype,
      category: claimObj.category,
      domain: claimObj.metadata?.domain || 'General',
      subDomain: claimObj.metadata?.subDomain || '',
      description: claimObj.metadata?.description || ''
    },
    publicationDetails: claimObj.metadata?.publicationDetails || claimObj.metadata || {},
    incentiveInfo: {
      incentiveCategory: claimObj.category,
      eligibleIncentive: 'Yes',
      estimatedAmount: userShare,
      claimStatus: frontendStatus
    },
    paymentDetails: claimObj.paymentDetails || null,
    createdAt: claimObj.createdAt,
    updatedAt: claimObj.updatedAt
  };
};

/**
 * @desc Step 1: Approve payment amount by Accounts department (Ready for annual payout)
 * @route PUT /api/submissions/:id/approve-payment
 * @access Private (accounts, admin)
 */
export const approveClaimPayment = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) {
    return errorResponse(res, 'Claim not found', null, 404);
  }

  claim.isAccountsApproved = true;
  if (!claim.isPaid) {
    claim.paymentStatus = 'APPROVED_BY_ACCOUNTS';
  }

  if (claim.authorPayments && claim.authorPayments.length > 0) {
    claim.authorPayments.forEach(p => {
      if (p.isMmdu && p.paymentStatus !== 'PAID') p.paymentStatus = 'READY_FOR_RELEASE';
    });
  }

  await claim.save();

  await ApprovalHistory.create({
    claim: claim._id,
    step: 'Payment Approved by Accounts',
    action: 'APPROVE_PAYMENT',
    fromStatus: claim.status,
    toStatus: claim.status,
    actionBy: req.user._id,
    actionByName: req.user.name,
    actionByRole: req.user.role,
    remarks: req.body.remarks || 'Incentive amount verified and approved by Accounts for annual payout cycle.',
    date: new Date()
  });

  const data = await transformClaimForResponse(claim, null, req.user);
  return successResponse(res, 'Claim payment approved successfully by Accounts', data);
});

/**
 * @desc Step 2: Mark single claim as paid in annual disbursement (Tick as Paid)
 * @route PUT /api/submissions/:id/pay
 * @access Private (accounts, admin)
 */
export const markClaimAsPaid = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id);
  if (!claim) {
    return errorResponse(res, 'Claim not found', null, 404);
  }

  claim.isAccountsApproved = true;
  claim.isPaid = true;
  claim.paymentStatus = 'PAID';
  const amount = claim.individualShare || claim.userShare || claim.approvedAmount || claim.totalIncentive || claim.calculatedAmount || claim.incentiveAmount || 0;
  claim.releasedAmount = amount;
  claim.paidAmount = amount;
  claim.paymentDetails = {
    transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    dateReleased: new Date().toISOString(),
    remarks: req.body.remarks || 'Annual Incentive Disbursed & Bank Credited.'
  };

  if (claim.authorPayments && claim.authorPayments.length > 0) {
    claim.authorPayments.forEach(p => {
      if (p.isMmdu) p.paymentStatus = 'PAID';
    });
  }

  await claim.save();

  await ApprovalHistory.create({
    claim: claim._id,
    step: 'Payment Released',
    action: 'RELEASE_PAYMENT',
    fromStatus: claim.status,
    toStatus: claim.status,
    actionBy: req.user._id,
    actionByName: req.user.name,
    actionByRole: req.user.role,
    remarks: req.body.remarks || 'Marked as paid in annual disbursement cycle.',
    date: new Date()
  });

  const data = await transformClaimForResponse(claim, null, req.user);
  return successResponse(res, 'Claim marked as paid successfully', data);
});

/**
 * @desc Mark multiple claims as paid in batch
 * @route POST /api/submissions/pay-batch
 * @access Private (accounts, admin)
 */
export const markBatchClaimsAsPaid = asyncHandler(async (req, res) => {
  const { claimIds, remarks } = req.body;
  if (!claimIds || !Array.isArray(claimIds) || claimIds.length === 0) {
    return errorResponse(res, 'claimIds array is required', null, 400);
  }

  const claims = await Claim.find({ _id: { $in: claimIds } });
  const updatedClaims = [];

  for (const claim of claims) {
    const totalEligible = await Claim.countDocuments({
      applicant: claim.applicant,
      status: { $in: ['RPC_VERIFICATION', 'ACCOUNTS_PROCESSING', 'COMPLETED'] }
    });

    if (totalEligible >= 2) {
      claim.isHeld = false;
      claim.heldReason = null;
    }

    const amount = claim.individualShare || claim.userShare || claim.approvedAmount || claim.totalIncentive || claim.calculatedAmount || claim.incentiveAmount || 0;
    claim.isPaid = true;
    claim.paymentStatus = 'PAID';
    claim.releasedAmount = amount;
    claim.paidAmount = amount;
    claim.paymentDetails = {
      transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dateReleased: new Date().toISOString(),
      remarks: remarks || 'Annual Incentive Disbursed & Bank Credited.'
    };

    if (claim.authorPayments && claim.authorPayments.length > 0) {
      claim.authorPayments.forEach(p => {
        if (p.isMmdu) p.paymentStatus = 'PAID';
      });
    }

    await claim.save();

    await ApprovalHistory.create({
      claim: claim._id,
      step: 'Payment Released',
      action: 'RELEASE_PAYMENT',
      fromStatus: claim.status,
      toStatus: claim.status,
      actionBy: req.user._id,
      actionByName: req.user.name,
      actionByRole: req.user.role,
      remarks: remarks || 'Marked as paid in annual disbursement cycle.',
      date: new Date()
    });

    const transformed = await transformClaimForResponse(claim, null, req.user);
    updatedClaims.push(transformed);
  }

  return successResponse(res, `Successfully marked ${updatedClaims.length} claims as paid`, updatedClaims);
});
