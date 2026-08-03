import PolicyRule from '../models/PolicyRule.js';
import Claim from '../models/Claim.js';
import logger from '../utils/logger.js';

/**
 * Determine the policy condition key from claim metadata.
 * Maps claim fields to policy rule conditions.
 */
const determineCondition = (claim) => {
  const { category, subtype, metadata } = claim;
  
  if (category === 'research_publications' || category === 'conferences') {
    if (subtype === 'conference' || category === 'conferences') {
      const indexingTier = metadata?.indexingTier || '';
      if (indexingTier.includes('IEEE') || indexingTier.includes('ACM') || indexingTier.includes('Scopus')) {
        return 'IEEE_ACM_SCOPUS';
      }
      return 'OTHER_INDEXED';
    }

    const indexingTier = String(metadata?.indexingTier || '');
    const quartile = String(metadata?.quartile || '');
    
    if (indexingTier.toLowerCase().includes('sci') || quartile.toUpperCase().startsWith('Q')) {
      if (quartile.toUpperCase() === 'Q1' || indexingTier.includes('Q1')) return 'Q1_SCI_SCIE';
      if (quartile.toUpperCase() === 'Q2' || indexingTier.includes('Q2')) return 'Q2_SCI_SCIE';
      if (quartile.toUpperCase() === 'Q3' || quartile.toUpperCase() === 'Q4' || indexingTier.includes('Q3') || indexingTier.includes('Q4')) return 'Q3_Q4_SCI_SCIE';
      return 'Q3_Q4_SCI_SCIE';
    }
    if (indexingTier.toLowerCase().includes('scopus')) return 'SCOPUS_ONLY';
    if (indexingTier.toLowerCase().includes('ugc')) return 'UGC_CARE';
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
  const categoryQuery = claim.category === 'conferences' ? { $in: ['conferences', 'research_publications'] } : claim.category;
  
  // Find matching active policy rule
  const policyRule = await PolicyRule.findOne({
    category: categoryQuery,
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
    category: categoryQuery,
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
  
  let totalIncentive = rule.incentiveAmount;
  
  // Table 1 S.No 1: Q3/Q4 Cumulative Publication Count Tiering
  // 1-2 pubs: ₹0 | 3-5 pubs: ₹10,000 | 6+ pubs: ₹15,000
  if (condition === 'Q3_Q4_SCI_SCIE') {
    const q3q4Count = (await Claim.countDocuments({
      applicant: claim.applicant,
      financialYear: claim.financialYear,
      category: 'research_publications',
      $or: [
        { 'metadata.quartile': { $in: ['Q3', 'Q4', 'q3', 'q4', 'Q3/Q4'] } },
        { 'policySnapshot.condition': 'Q3_Q4_SCI_SCIE' }
      ],
      status: { $nin: ['DRAFT', 'REJECTED'] },
      _id: { $ne: claim._id }
    })) + 1; // Count including current claim

    if (q3q4Count < 3) {
      totalIncentive = 0; // Less than 3 Q3/Q4 publications in calendar/financial year = ₹0
    } else if (q3q4Count >= 6) {
      totalIncentive = 15000; // 6 and above Q3/Q4 publications = ₹15,000
    } else {
      totalIncentive = 10000; // 3 to 5 Q3/Q4 publications = ₹10,000
    }
  }

  // Clause d: Conference category — "either registration fees or an incentive whichever is less will be given"
  if (claim.category === 'conferences' || claim.subtype === 'conference') {
    const regFee = Number(claim.metadata?.registrationFee || claim.metadata?.registrationAmount || claim.metadata?.fee || claim.metadata?.registrationFees);
    if (!isNaN(regFee) && regFee > 0) {
      totalIncentive = Math.min(totalIncentive, regFee);
    }
  }

  // Extract and parse authors from claim metadata
  const rawAuthors = Array.isArray(claim.metadata?.authors) && claim.metadata.authors.length > 0
    ? claim.metadata.authors
    : [{ name: claim.applicantName, department: claim.department, employeeId: '', isMmdu: true }];

  const mmduAuthors = rawAuthors.filter(a => a.isMmdu !== false && a.isMmdu !== 'no' && String(a.isMmdu).toLowerCase() !== 'false');
  const mmduAuthorCount = Math.max(1, mmduAuthors.length);
  const individualShare = Math.round(totalIncentive / mmduAuthorCount);

  const authorPayments = rawAuthors.map(author => {
    const isMmdu = author.isMmdu !== false && author.isMmdu !== 'no' && String(author.isMmdu).toLowerCase() !== 'false';
    return {
      name: author.name || 'Author',
      employeeId: author.employeeId || author.id || '',
      department: author.department || claim.department,
      institution: isMmdu ? 'MMDU' : (author.institution || 'External'),
      isMmdu: isMmdu,
      payableAmount: isMmdu ? individualShare : 0,
      paymentStatus: 'HELD'
    };
  });

  let amount = individualShare; // Applicant's share of total incentive
  
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
        totalIncentive: 0,
        mmduAuthorCount,
        individualShare: 0,
        authorPayments: [],
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
    totalIncentive,
    mmduAuthorCount,
    individualShare,
    calculatedAmount: amount,
    currency: 'INR',
    multiAuthorRule: 'divide_equally_mmdu',
    calculatedAt: new Date()
  };
  
  return {
    amount,
    totalIncentive,
    mmduAuthorCount,
    individualShare,
    authorPayments,
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
