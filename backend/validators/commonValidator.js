import mongoose from 'mongoose';

/**
 * Validate that a string is a valid MongoDB ObjectId.
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate DOI format.
 * Pattern: 10.XXXX/rest-of-doi
 */
export const isValidDOI = (doi) => {
  if (!doi) return true; // Optional
  const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
  return doiRegex.test(doi);
};

/**
 * Validate ISSN format.
 * Pattern: XXXX-XXXX
 */
export const isValidISSN = (issn) => {
  if (!issn) return true;
  const issnRegex = /^\d{4}-\d{3}[\dX]$/i;
  return issnRegex.test(issn);
};

/**
 * Validate ISBN format (10 or 13 digit).
 */
export const isValidISBN = (isbn) => {
  if (!isbn) return true;
  const cleaned = isbn.replace(/[-\s]/g, '');
  return cleaned.length === 10 || cleaned.length === 13;
};

/**
 * Validate Indian financial year format.
 * Pattern: YYYY-YY (e.g., 2026-27)
 */
export const isValidFinancialYear = (fy) => {
  if (!fy) return false;
  const fyRegex = /^\d{4}-\d{2}$/;
  return fyRegex.test(fy);
};

/**
 * Sanitize string input.
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};
