import { isValidObjectId, isValidDOI } from './commonValidator.js';

/**
 * Validate submission creation request body.
 * @param {Object} body - Request body
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateSubmission = (body) => {
  const errors = [];
  
  // Must have either typeId or (category + subtype)
  if (!body.typeId && !body.category) {
    errors.push('typeId or category is required');
  }
  
  // Metadata validation
  if (!body.metadata || typeof body.metadata !== 'object') {
    errors.push('metadata object is required');
  } else {
    // Title is required in metadata
    if (!body.metadata.title && !body.title) {
      errors.push('Title is required');
    }
    
    // DOI validation if provided
    if (body.metadata.doi && !isValidDOI(body.metadata.doi)) {
      errors.push('Invalid DOI format. Expected: 10.XXXX/...');
    }
  }
  
  // Status must be DRAFT or DEPARTMENT_REVIEW
  if (body.status && !['DRAFT', 'DEPARTMENT_REVIEW'].includes(body.status)) {
    errors.push('Status must be DRAFT or DEPARTMENT_REVIEW for new submissions');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate submission update request body.
 */
export const validateSubmissionUpdate = (body) => {
  const errors = [];
  
  if (body.metadata && typeof body.metadata !== 'object') {
    errors.push('metadata must be an object');
  }
  
  if (body.metadata?.doi && !isValidDOI(body.metadata.doi)) {
    errors.push('Invalid DOI format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
