import PolicyRule from '../models/PolicyRule.js';
import Claim from '../models/Claim.js';
import logger from '../utils/logger.js';

/**
 * Determine the policy condition key from claim metadata.
 * Maps claim fields to policy rule conditions.
 */
const determineCondition = (claim) => {
  const { category, subtype, metadata } = claim;
  
  if (category === 'research_publications') {
    const indexingTier = metadata?.indexingTier || '';
    const quartile = metadata?.quartile || '';
    
    if (indexingTier.includes('SCI')) {
      if (quartile === 'Q1') return 'Q1_SCI_SCIE';
      if (quartile === 'Q2') return 'Q2_SCI_SCIE';
      return 'Q3_Q4_SCI_SCIE';
    }
    if (indexingTier.includes('Scopus')) return 'SCOPUS_ONLY';
    if (indexingTier.includes('UGC')) return 'UGC_CARE';
    return 'OTHER';
  }
  
  if (category === 'books_chapters') {
    // Determine by publisher recognition
    const publisher = (metadata?.publisher || '').toLowerCase();
    const internationalPublishers = ['springer', 'elsevier', 'wiley', 'ieee', 'acm', 'taylor', 'cambridge', 'oxford', 'mcgraw', 'pearson', 'prentice'];
    const isInternational = internationalPublishers.some(p => publisher.includes(p));
    
    if (subtype === 'book' || subtype === 'edited_book') {
      return isInternational ? 'INTERNATIONAL_PUBLISHER' : 'NATIONAL_PUBLISHER';
    }
    return 'ANY'; // book chapters
  }
  
  if (category === 'intellectual_property') {
    if (subtype === 'patent_granted') {
      const office = (metadata?.patentOffice || '').toLowerCase();
      return office.includes('india') || office.includes('ipo') ? 'GRANTED_INDIAN' : 'GRANTED_INTERNATIONAL';
    }
    if (subtype === 'patent_filed') return 'FILED';
    if (subtype === 'patent_published') return 'PUBLISHED';
    if (subtype === 'copyright') return 'REGISTERED';
    return 'OTHER';
  }
  
  if (category === 'innovation_projects') {
    if (subtype === 'startup_registered') return 'REGISTERED';
    if (subtype === 'startup_incubated') return 'INCUBATED';
    if (subtype === 'startup_commercialized') return 'COMMERCIALIZED';
    return 'ANY';
  }
  
  return 'OTHER';
};

/**
 * Count internal authors from coAuthors list.
 */
const countInternalAuthors = (metadata) => {
  const coAuthors = metadata?.coAuthors || [];
  // Internal authors have employee IDs like 'EMP-101'
  // Plus the applicant themselves = total internal
  return coAuthors.length + 1; // +1 for the applicant
};

/**
 * Calculate incentive amount for a claim based on active policy rules.
 * @param {Object} claim - Claim document
 * @returns {Object} { amount, scorePoints, policySnapshot, policyRule }
 */
export const calculateIncentive = async (claim) => {
  const condition = determineCondition(claim);
  
  // Find matching active policy rule
  const policyRule = await PolicyRule.findOne({
    category: claim.category,
    subtype: claim.subtype,
    condition,
    isActive: true,
    $and: [
      { $or: [{ effectiveFrom: { $exists: false } }, { effectiveFrom: null }, { effectiveFrom: { $lte: new Date() } }] },
      { $or: [{ effectiveTo: { $exists: false } }, { effectiveTo: null }, { effectiveTo: { $gte: new Date() } }] }
    ]
  });
  
  // Also try broader match (condition = 'ANY') if specific not found
  const fallbackRule = !policyRule ? await PolicyRule.findOne({
    category: claim.category,
    subtype: claim.subtype,
    condition: 'ANY',
    isActive: true
  }) : null;
  
  const rule = policyRule || fallbackRule;
  
  if (!rule) {
    logger.warn(`No policy rule found for ${claim.category}/${claim.subtype}/${condition}`);
    return {
      amount: 0,
      scorePoints: 0,
      policySnapshot: { error: 'No matching policy rule found', condition },
      policyRule: null
    };
  }
  
  // Check applicant type eligibility
  if (rule.applicantType !== 'both' && rule.applicantType !== claim.applicantRole) {
    return {
      amount: 0,
      scorePoints: 0,
      policySnapshot: { error: `Policy not applicable for ${claim.applicantRole}`, rule: rule.toObject() },
      policyRule: rule
    };
  }
  
  let amount = rule.incentiveAmount;
  
  // Apply multi-author rules
  const totalInternalAuthors = countInternalAuthors(claim.metadata);
  if (totalInternalAuthors > 1 && rule.multiAuthorRule === 'divide_equally') {
    amount = Math.round(amount / totalInternalAuthors);
  }
  // For 'first_author_full' and 'corresponding_author_full', keep full amount
  
  // Check annual limits
  if (rule.maxClaimsPerYear > 0) {
    const existingClaimsCount = await Claim.countDocuments({
      applicant: claim.applicant,
      financialYear: claim.financialYear,
      category: claim.category,
      status: { $nin: ['DRAFT', 'REJECTED'] },
      _id: { $ne: claim._id }
    });
    if (existingClaimsCount >= rule.maxClaimsPerYear) {
      return {
        amount: 0,
        scorePoints: 0,
        policySnapshot: { error: `Annual claim limit (${rule.maxClaimsPerYear}) exceeded`, rule: rule.toObject() },
        policyRule: rule
      };
    }
  }
  
  if (rule.maxAmountPerYear > 0) {
    const existingAmountResult = await Claim.aggregate([
      {
        $match: {
          applicant: claim.applicant,
          financialYear: claim.financialYear,
          category: claim.category,
          status: { $nin: ['DRAFT', 'REJECTED'] },
          _id: { $ne: claim._id }
        }
      },
      { $group: { _id: null, total: { $sum: '$approvedAmount' } } }
    ]);
    const existingTotal = existingAmountResult[0]?.total || 0;
    if (existingTotal + amount > rule.maxAmountPerYear) {
      amount = Math.max(0, rule.maxAmountPerYear - existingTotal);
    }
  }
  
  // Create policy snapshot (frozen values at time of calculation)
  const policySnapshot = {
    ruleId: rule._id,
    condition,
    baseAmount: rule.incentiveAmount,
    calculatedAmount: amount,
    currency: 'INR',
    multiAuthorRule: rule.multiAuthorRule,
    totalInternalAuthors,
    maxClaimsPerYear: rule.maxClaimsPerYear,
    maxAmountPerYear: rule.maxAmountPerYear,
    applicantType: rule.applicantType,
    calculatedAt: new Date()
  };
  
  return {
    amount,
    scorePoints: rule.scorePoints || 0,
    policySnapshot,
    policyRule: rule
  };
};

/**
 * Check for duplicate DOI across all non-rejected claims.
 */
export const checkDuplicateDOI = async (doi, excludeClaimId = null) => {
  if (!doi) return false;
  const query = {
    'metadata.doi': doi,
    status: { $nin: ['REJECTED'] }
  };
  if (excludeClaimId) query._id = { $ne: excludeClaimId };
  const existing = await Claim.findOne(query);
  return !!existing;
};
