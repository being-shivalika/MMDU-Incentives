import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import * as claimService from '../services/claimService.js';
import * as approvalService from '../services/approvalService.js';
import ApprovalHistory from '../models/ApprovalHistory.js';

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
  const data = result.claims.map(claim => transformClaimForResponse(claim));
  
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
  
  const data = transformClaimForResponse(claim, approvalHistory);
  return successResponse(res, 'Claim created successfully', data, 201);
});

/**
 * @desc Get a single submission with full approval history
 * @route GET /api/submissions/:id
 * @access Private
 */
export const getSubmission = asyncHandler(async (req, res) => {
  const { claim, approvalHistory } = await claimService.getClaimById(req.params.id);
  const data = transformClaimForResponse(claim, approvalHistory);
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
  
  const data = transformClaimForResponse(claim, approvalHistory);
  return successResponse(res, 'Claim updated successfully', data);
});

/**
 * @desc Save as draft
 * @route PUT /api/submissions/:id/draft
 * @access Private (faculty, student)
 */
export const saveDraft = asyncHandler(async (req, res) => {
  const claim = await claimService.saveDraft(req.params.id, req.body, req.user);
  const data = transformClaimForResponse(claim);
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
 * Maps MongoDB _id to id, aliases metadata as fields, includes approvalHistory.
 */
const transformClaimForResponse = (claim, approvalHistory = null) => {
  const claimObj = claim.toJSON ? claim.toJSON() : claim;
  
  // Mapping currentDesk to currentLevel
  let currentLevel = 'Applicant';
  if (claimObj.currentDesk === 'hod') currentLevel = 'HOD';
  else if (claimObj.currentDesk === 'principal') currentLevel = 'Principal';
  else if (claimObj.currentDesk === 'director') currentLevel = 'Director';
  else if (claimObj.currentDesk === 'rpc_cell' || claimObj.currentDesk === 'rpc') currentLevel = 'RPC';
  else if (claimObj.currentDesk === 'accounts') currentLevel = 'Accounts';
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
    incentiveAmount: claimObj.approvedAmount || claimObj.calculatedAmount || 0,
    calculatedAmount: claimObj.calculatedAmount,
    approvedAmount: claimObj.approvedAmount,
    releasedAmount: claimObj.releasedAmount,
    paidAmount: claimObj.paidAmount,
    currency: claimObj.currency || 'INR',
    researchScore: claimObj.researchScore,
    fields: claimObj.metadata || {},
    metadata: claimObj.metadata || {},
    workflowProgress: claimObj.workflowProgress || null,
    
    workflowHistory: approvalHistory 
      ? approvalHistory.map(h => ({
          level: h.actionByRole === 'hod' ? 'HOD' : h.actionByRole === 'principal' ? 'Principal' : h.actionByRole === 'director' ? 'Director' : h.actionByRole === 'accounts' ? 'Accounts' : 'Applicant',
          action: h.action.includes('REJECT') ? 'Rejected' : h.action.includes('RETURN') ? 'Revision Requested' : h.action.includes('SUBMIT') ? 'Submitted' : 'Approved',
          by: h.actionByName,
          remarks: h.remarks,
          date: h.date
        }))
      : [],
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
      estimatedAmount: claimObj.calculatedAmount || claimObj.approvedAmount || 0,
      claimStatus: frontendStatus
    },
    permissions: { canEdit: claimObj.status === 'DRAFT' || claimObj.status === 'RETURNED' },
    paymentDetails: claimObj.paymentDetails || null,
    createdAt: claimObj.createdAt,
    updatedAt: claimObj.updatedAt
  };
};
