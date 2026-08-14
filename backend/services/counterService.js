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
 * Generate a structured claim number.
 * Formatted like: General/MMDU/123, Publication/MMDU/768, MBA/2026/1234
 * @param {Object} claimData
 * @param {Object} user
 * @returns {string} Structured Submit ID
 */
export const generateClaimNumber = async (claimData = {}, user = {}) => {
  const year = new Date().getFullYear().toString();

  const cat = String(claimData.category || claimData.typeId || claimData.subtype || '').toLowerCase();
  const dept = String(claimData.department || user.department || '').toLowerCase();

  let prefixCategory = 'General';
  if (cat.includes('pub') || cat.includes('journal')) prefixCategory = 'Publication';
  else if (cat.includes('conf')) prefixCategory = 'Conference';
  else if (cat.includes('book')) prefixCategory = 'Book';
  else if (cat.includes('patent') || cat.includes('property') || cat.includes('ip')) prefixCategory = 'Patent';
  else if (cat.includes('copyright')) prefixCategory = 'Copyright';

  const counter = await Counter.findOneAndUpdate(
    { name: 'claimNumber', year },
    { $inc: { seq: 1 }, $setOnInsert: { prefix: 'MMDU' } },
    { new: true, upsert: true }
  );

  const seq = String(counter.seq);

  if (dept.includes('mba') || dept.includes('management')) {
    return `MBA/${year}/${seq}`;
  }
  return `${prefixCategory}/MMDU/${seq}`;
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
