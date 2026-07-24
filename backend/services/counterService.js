import Counter from '../models/Counter.js';

/**
 * Get next sequence number. Uses MongoDB findOneAndUpdate with $inc for atomicity.
 * @param {string} name - Counter name (e.g., 'claimNumber', 'voucherNumber')
 * @param {string} prefix - Prefix (e.g., 'RPMS', 'VCH')
 * @param {string} year - Year string (e.g., '2026')
 * @returns {string} Formatted ID like 'RPMS-2026-0001'
 */
export const getNextSequence = async (name, prefix, year) => {
  const counter = await Counter.findOneAndUpdate(
    { name, year },
    { $inc: { seq: 1 }, $setOnInsert: { prefix } },
    { new: true, upsert: true }
  );
  const paddedSeq = String(counter.seq).padStart(4, '0');
  return `${prefix}-${year}-${paddedSeq}`;
};

/**
 * Generate a claim number for the current year.
 * @returns {string} e.g., 'RPMS-2026-0001'
 */
export const generateClaimNumber = async () => {
  const year = new Date().getFullYear().toString();
  return getNextSequence('claimNumber', 'RPMS', year);
};

/**
 * Generate a voucher number.
 * @returns {string} e.g., 'VCH-2026-0001'
 */
export const generateVoucherNumber = async () => {
  const year = new Date().getFullYear().toString();
  return getNextSequence('voucherNumber', 'VCH', year);
};

/**
 * Generate a sanction number.
 * @returns {string} e.g., 'SAN-2026-0001'
 */
export const generateSanctionNumber = async () => {
  const year = new Date().getFullYear().toString();
  return getNextSequence('sanctionNumber', 'SAN', year);
};
