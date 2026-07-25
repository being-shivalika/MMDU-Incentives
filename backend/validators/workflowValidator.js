import { isValidObjectId } from './commonValidator.js';

/**
 * Validate workflow transition request body.
 * @param {Object} body - { submissionId, actionType, comment, incentiveAmount }
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateTransition = (body) => {
  const errors = [];
  
  if (!body.submissionId) {
    errors.push('submissionId is required');
  } else if (!isValidObjectId(body.submissionId)) {
    errors.push('Invalid submissionId format');
  }
  
  if (!body.actionType) {
    errors.push('actionType is required');
  }
  
  // Rejection actions require a non-empty comment
  const rejectionActions = ['REJECT_PERMANENTLY', 'REJECT', 'REJECT_TO_PRINCIPAL', 'WITHDRAW_CLAIM'];
  if (rejectionActions.includes(body.actionType)) {
    if (!body.comment || body.comment.trim() === '') {
      errors.push('Rejection reason is mandatory and cannot be empty');
    }
  }
  
  // Return actions require remarks
  const returnActions = ['RETURN_TO_FACULTY', 'RETURN_TO_PRINCIPAL', 'RETURN'];
  if (returnActions.includes(body.actionType)) {
    if (!body.comment || body.comment.trim() === '') {
      errors.push('Remarks are required when returning a claim');
    }
  }
  
  // incentiveAmount must be positive if provided
  if (body.incentiveAmount !== undefined && body.incentiveAmount !== null) {
    if (typeof body.incentiveAmount !== 'number' || body.incentiveAmount < 0) {
      errors.push('incentiveAmount must be a positive number (in INR)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
