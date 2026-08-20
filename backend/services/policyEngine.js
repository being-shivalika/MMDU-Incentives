import PolicyRule from '../models/PolicyRule.js';
import Claim from '../models/Claim.js';
import logger from '../utils/logger.js';
import { recalculateClaimAuthorShares } from './authorDistributionService.js';

/**
 * Determine the policy condition key from claim metadata.
 * Maps claim fields to policy rule conditions.
 */
export const determineCondition = (claim) => {
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
    const quartile = String(metadata?.quartile || '').toUpperCase().trim();
    
    if (quartile === 'Q1' || indexingTier.includes('Q1')) return 'Q1_SCI_SCIE';
    if (quartile === 'Q2' || indexingTier.includes('Q2')) return 'Q2_SCI_SCIE';
    if (quartile === 'Q3' || quartile === 'Q4' || quartile === 'Q3/Q4' || indexingTier.includes('Q3') || indexingTier.includes('Q4')) return 'Q3_Q4_SCI_SCIE';

    if (indexingTier.toLowerCase().includes('sci')) return 'Q3_Q4_SCI_SCIE';
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
 * Sync Q3/Q4 cumulative incentive amounts across all non-rejected claims for an applicant.
 */
export const syncApplicantQ3Q4Claims = async (applicantId, financialYear) => {
  if (!applicantId) return;

  const q3q4Claims = await Claim.find({
    applicant: applicantId,
    financialYear,
    category: 'research_publications',
    $or: [
      { 'metadata.quartile': { $in: ['Q3', 'Q4', 'q3', 'q4', 'Q3/Q4'] } },
      { 'policySnapshot.condition': 'Q3_Q4_SCI_SCIE' }
    ],
    status: { $nin: ['DRAFT', 'REJECTED'] }
  });

  const count = q3q4Claims.length;
  const targetTotal = count >= 6 ? 15000 : count >= 3 ? 10000 : 0;

  for (const claim of q3q4Claims) {
    if (claim.totalIncentive !== targetTotal) {
      const authorCount = Math.max(1, claim.mmduAuthorCount || 1);
      const share = Math.round(targetTotal / authorCount);
      claim.totalIncentive = targetTotal;
      claim.calculatedAmount = share;
      claim.approvedAmount = share;
      claim.individualShare = share;
      if (claim.authorPayments && claim.authorPayments.length > 0) {
        claim.authorPayments.forEach(p => {
          if (p.isMmdu) p.payableAmount = share;
        });
      }
      if (claim.policySnapshot) {
        claim.policySnapshot.totalIncentive = targetTotal;
        claim.policySnapshot.individualShare = share;
        claim.policySnapshot.calculatedAmount = share;
      }
      await claim.save();
    }
  }
};

/**
 * Calculate incentive amount for a claim based on active policy rules.
 * @param {Object} claim - Claim document
 * @returns {Object} { amount, scorePoints, policySnapshot, policyRule }
 */
export const calculateIncentive = async (claim) => {
  const condition = determineCondition(claim);
  const categoryQuery = claim.category === 'conferences' ? { $in: ['conferences', 'research_publications'] } : claim.category;
  const normSubtype = (claim.subtype || '').replace('_publication', '');
  const subtypeQuery = { $in: [claim.subtype, normSubtype] };

  // Find matching active policy rule
  const policyRule = await PolicyRule.findOne({
    category: categoryQuery,
    subtype: subtypeQuery,
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
    subtype: subtypeQuery,
    condition: 'ANY',
    isActive: true
  }) : null;
  
  const rule = policyRule || fallbackRule;
  
  let totalIncentive = rule ? rule.incentiveAmount : 0;
  
  // Exact policy rules for Q1, Q2, Q3/Q4
  if (condition === 'Q1_SCI_SCIE') {
    totalIncentive = 25000;
  } else if (condition === 'Q2_SCI_SCIE') {
    totalIncentive = 20000;
  } else if (condition === 'Q3_Q4_SCI_SCIE') {
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
      totalIncentive = 0; // Less than 3 Q3/Q4 publications in year = ₹0
    } else if (q3q4Count >= 6) {
      totalIncentive = 15000; // 6 and above Q3/Q4 publications = ₹15,000
    } else {
      totalIncentive = 10000; // 3 to 5 Q3/Q4 publications = ₹10,000
    }
  }

  // Exact policy rule overrides for Books, Book Chapters, and Conferences per MMDU Policy Table
  if (claim.category === 'books_chapters') {
    if (claim.subtype === 'book') {
      totalIncentive = 15000; // Books (ISBN) only as author (not edited books) = ₹15,000
    } else if (claim.subtype === 'book_chapter' || claim.subtype === 'edited_book') {
      totalIncentive = 8000; // Book Chapter (indexed in Scopus/WoS) = ₹8,000
    }
  }

  if (claim.category === 'conferences' || claim.subtype === 'conference') {
    totalIncentive = 8000; // Full-length Paper Publications in Conference (indexed in Scopus/WoS) = ₹8,000
    const regFee = Number(claim.metadata?.registrationFee || claim.metadata?.registrationAmount || claim.metadata?.fee || claim.metadata?.registrationFees);
    if (!isNaN(regFee) && regFee > 0) {
      totalIncentive = Math.min(totalIncentive, regFee);
    }
  }

  // Extract and parse authors from claim metadata
  const rawAuthors = Array.isArray(claim.metadata?.authors) && claim.metadata.authors.length > 0
    ? claim.metadata.authors
    : [{ name: claim.applicantName, department: claim.department, employeeId: '', isMmdu: true }];

  const checkIsMmdu = (a) => {
    if (!a) return false;
    if (a.isMmdu === false || a.isMmdu === 'no' || String(a.isMmdu).toLowerCase() === 'false') return false;
    const inst = String(a.institution || a.affiliation || a.university || '').toLowerCase();
    if (inst && (inst.includes('external') || inst.includes('other')) && !inst.includes('mmdu') && !inst.includes('maharishi markandeshwar')) {
      return false;
    }
    return true;
  };

  claim.totalIncentive = totalIncentive;
  await recalculateClaimAuthorShares(claim);

  const mmduAuthorCount = claim.mmduAuthorCount || 1;
  const individualShare = claim.individualShare || Math.round(totalIncentive / mmduAuthorCount);
  const authorPayments = claim.authorPayments || [];
  let amount = individualShare; // Applicant's share of total incentive
  
  // Check annual limits safely
  if (rule?.maxClaimsPerYear > 0) {
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
        policySnapshot: { error: `Annual claim limit (${rule.maxClaimsPerYear}) exceeded`, rule: rule.toObject ? rule.toObject() : rule },
        policyRule: rule
      };
    }
  }
  
  if (rule?.maxAmountPerYear > 0) {
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
    ruleId: rule?._id || null,
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
    scorePoints: rule?.scorePoints || 0,
    policySnapshot,
    policyRule: rule
  };
};

/**
 * Check for duplicate claim submissions based on DOI, Scopus Link, Verification Links, and Title.
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

/**
 * Check for duplicate claim submissions across all non-rejected claims.
 */
export const checkDuplicateSubmission = async (claimData, excludeClaimId = null) => {
  const metadata = claimData.metadata || {};

  const doi = (metadata.doi || metadata.firstVerification || "").trim().toLowerCase();
  const firstVerification = (metadata.firstVerification || "").trim().toLowerCase();
  const secondVerification = (metadata.secondVerification || metadata.scopusLink || "").trim().toLowerCase();
  const title = (claimData.title || metadata.title || "").trim().toLowerCase().replace(/\s+/g, ' ');

  if (!doi && !firstVerification && !secondVerification && !title) {
    return { isDuplicate: false };
  }

  // Find all active (non-rejected) claims
  const query = {
    status: { $nin: ['REJECTED'] }
  };
  if (excludeClaimId) {
    query._id = { $ne: excludeClaimId };
  }

  const existingClaims = await Claim.find(query).select('claimNumber applicantName title metadata').lean();

  for (const existing of existingClaims) {
    const exMeta = existing.metadata || {};

    const exDoi = (exMeta.doi || exMeta.firstVerification || "").trim().toLowerCase();
    const exFirstVer = (exMeta.firstVerification || "").trim().toLowerCase();
    const exSecondVer = (exMeta.secondVerification || exMeta.scopusLink || "").trim().toLowerCase();
    const exTitle = (existing.title || exMeta.title || "").trim().toLowerCase().replace(/\s+/g, ' ');

    // 1. Scopus Link / Paper Link match
    if (secondVerification && secondVerification.length > 5 && (secondVerification === exSecondVer || secondVerification === exFirstVer)) {
      return {
        isDuplicate: true,
        reason: `A submission with this Scopus Link / Paper URL already exists in the system (${existing.claimNumber} submitted by ${existing.applicantName || 'another author'}). Duplicate submissions for the same paper are not allowed.`
      };
    }

    // 2. DOI / Primary Verification Link match
    if (doi && doi.length > 3 && (doi === exDoi || doi === exFirstVer || doi === exSecondVer)) {
      return {
        isDuplicate: true,
        reason: `A submission with this DOI / Paper Link already exists in the system (${existing.claimNumber} submitted by ${existing.applicantName || 'another author'}). Duplicate submissions for the same paper are not allowed.`
      };
    }

    if (firstVerification && firstVerification.length > 3 && (firstVerification === exFirstVer || firstVerification === exDoi || firstVerification === exSecondVer)) {
      return {
        isDuplicate: true,
        reason: `A submission with this verification link/ID (${firstVerification}) already exists in the system (${existing.claimNumber} submitted by ${existing.applicantName || 'another author'}).`
      };
    }

    // 3. Exact Title match (for titles > 8 characters)
    if (title && title.length > 8 && title === exTitle) {
      return {
        isDuplicate: true,
        reason: `A submission with the exact same Title "${existing.title}" already exists in the system (${existing.claimNumber} submitted by ${existing.applicantName || 'another author'}). Co-authors cannot submit duplicate claims for an already submitted paper.`
      };
    }
  }

  return { isDuplicate: false };
};
