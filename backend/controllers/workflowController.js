import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import * as approvalService from '../services/approvalService.js';
import ApprovalHistory from '../models/ApprovalHistory.js';
import WorkflowConfig from '../models/WorkflowConfig.js';

/**
 * @desc Process a workflow transition
 * @route POST /api/workflow/transition
 * @access Private (role-based)
 */
export const processTransition = asyncHandler(async (req, res) => {
  const { submissionId, actionType, comment, incentiveAmount } = req.body;
  
  if (!submissionId || !actionType) {
    return errorResponse(res, 'submissionId and actionType are required', null, 400);
  }
  
  const { claim, approvalHistory } = await approvalService.processTransition(
    submissionId,
    actionType,
    req.user,
    comment,
    incentiveAmount,
    req.ip
  );
  
  // Transform for frontend
  const claimObj = claim.toJSON ? claim.toJSON() : claim;
  const data = {
    id: claimObj.id || claimObj._id,
    claimNumber: claimObj.claimNumber,
    title: claimObj.title,
    category: claimObj.category,
    subtype: claimObj.subtype,
    status: claimObj.status,
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
    fields: claimObj.metadata || {},
    metadata: claimObj.metadata || {},
    workflowProgress: claimObj.workflowProgress || null,
    approvalHistory: approvalHistory.map(h => ({
      step: h.step,
      status: h.action.includes('REJECT') ? 'rejected' :
              h.action.includes('RETURN') ? 'returned' : 'completed',
      actionBy: h.actionBy,
      actionByName: h.actionByName,
      remarks: h.remarks,
      date: h.date
    })),
    paymentDetails: claimObj.paymentDetails || null
  };
  
  return successResponse(res, 'Workflow transition processed successfully', data);
});

/**
 * @desc Get active workflow configuration
 * @route GET /api/workflow/config
 * @access Private (admin)
 */
export const getWorkflowConfig = asyncHandler(async (req, res) => {
  const config = await WorkflowConfig.findOne({ isActive: true });
  return successResponse(res, 'Workflow configuration retrieved', config);
});

/**
 * @desc Update workflow configuration
 * @route PUT /api/workflow/config/:id
 * @access Private (admin)
 */
export const updateWorkflowConfig = asyncHandler(async (req, res) => {
  const config = await WorkflowConfig.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!config) {
    return errorResponse(res, 'Workflow configuration not found', null, 404);
  }
  // Invalidate cache
  const { invalidateCache } = await import('../services/workflowConfigService.js');
  invalidateCache();
  
  return successResponse(res, 'Workflow configuration updated', config);
});
