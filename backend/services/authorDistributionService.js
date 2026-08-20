import User from '../models/User.js';
import Claim from '../models/Claim.js';
import { determineCondition } from './policyEngine.js';

/**
 * Calculate individual author's eligible incentive amount based on policy rules & author's publication history.
 */
export const getAuthorEligibleIncentive = async (author, claim, condition, baseRuleAmount) => {
  if (!author || !author.isMmdu) {
    return 0;
  }

  // 1. Exact Policy Rules for Q1, Q2, Q3/Q4
  if (condition === 'Q1_SCI_SCIE') {
    return 25000;
  } else if (condition === 'Q2_SCI_SCIE') {
    return 20000;
  } else if (condition === 'Q3_Q4_SCI_SCIE') {
    let authorUser = null;
    const cleanEmpId = (author.employeeId || author.id || '').trim();
    const cleanEmail = (author.email || '').trim().toLowerCase();
    const cleanName = (author.name || '').trim();

    if (cleanEmpId) {
      authorUser = await User.findOne({ employeeId: cleanEmpId }).select('_id employeeId name').lean();
    }
    if (!authorUser && cleanEmail) {
      authorUser = await User.findOne({ email: cleanEmail }).select('_id employeeId name').lean();
    }
    if (!authorUser && cleanName) {
      authorUser = await User.findOne({ name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }).select('_id employeeId name').lean();
    }

    const isApplicant = Boolean(
      (cleanName && claim.applicantName && cleanName.toLowerCase() === claim.applicantName.toLowerCase()) ||
      (cleanEmpId && claim.authorPayments && claim.authorPayments[0]?.employeeId === cleanEmpId)
    );

    const authorEmpId = authorUser?.employeeId || cleanEmpId;
    const authorId = authorUser?._id || (isApplicant ? claim.applicant : null);
    const authorName = authorUser?.name || cleanName;

    // Count qualifying Q3/Q4 claims in FY specifically for THIS author
    const authorQuery = {
      financialYear: claim.financialYear,
      category: 'research_publications',
      $or: [
        { 'metadata.quartile': { $in: ['Q3', 'Q4', 'q3', 'q4', 'Q3/Q4'] } },
        { 'policySnapshot.condition': 'Q3_Q4_SCI_SCIE' }
      ],
      status: { $nin: ['DRAFT', 'REJECTED'] }
    };

    const authorMatchOr = [];
    if (authorId) authorMatchOr.push({ applicant: authorId });
    if (authorEmpId) authorMatchOr.push({ 'authorPayments.employeeId': authorEmpId });
    if (authorName) authorMatchOr.push({ 'authorPayments.name': new RegExp(`^${authorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });

    if (authorMatchOr.length === 0) {
      return 0; // Author cannot be identified in DB history -> 0 prior qualifying claims
    }

    authorQuery.$and = authorQuery.$and || [];
    authorQuery.$and.push({ $or: authorMatchOr });

    let q3q4Count = await Claim.countDocuments(authorQuery);
    
    // Check if current claim is already included in database
    const claimIdStr = claim._id ? claim._id.toString() : null;
    if (claimIdStr) {
      const isCounted = await Claim.findOne({ _id: claim._id, ...authorQuery });
      if (!isCounted) q3q4Count += 1;
    } else {
      q3q4Count += 1; // Current new submission
    }

    if (q3q4Count < 3) {
      return 0; // Threshold of 3 qualifying publications not met = ₹0
    } else if (q3q4Count >= 6) {
      return 15000; // 6+ qualifying publications = ₹15,000
    } else {
      return 10000; // 3 to 5 qualifying publications = ₹10,000
    }
  }

  // Books / Book Chapters / Conferences
  if (claim.category === 'books_chapters') {
    if (claim.subtype === 'book') return 15000;
    if (claim.subtype === 'book_chapter' || claim.subtype === 'edited_book') return 8000;
  }

  if (claim.category === 'conferences' || claim.subtype === 'conference') {
    let confAmt = 8000;
    const regFee = Number(claim.metadata?.registrationFee || claim.metadata?.registrationAmount || claim.metadata?.fee || claim.metadata?.registrationFees);
    if (!isNaN(regFee) && regFee > 0) {
      confAmt = Math.min(confAmt, regFee);
    }
    return confAmt;
  }

  return baseRuleAmount || 0;
};

/**
 * Recalculates author incentive shares for a claim based on individual author eligibility and dynamic author count.
 * 
 * IMPORTANT SYSTEM RULES:
 * 1. Freeze Rule: If already paid (isPaid === true OR status === 'COMPLETED'), distribution is locked.
 * 2. Calculation: Author Eligible Incentive ÷ Total Number of Authors = Author's Share.
 * 3. Eligibility: Evaluated independently per author.
 * 4. Dynamic Denominator: totalAuthors = actual authors attached to the submission.
 * 5. Inactive Redistribution: Unpaid share of inactive MMDU author is redistributed among active MMDU authors.
 */
export const recalculateClaimAuthorShares = async (claim) => {
  if (!claim) return claim;

  // Freeze Rule: If already paid, do not alter distribution
  const isPaid = Boolean(
    claim.isPaid || 
    claim.paymentStatus === 'PAID' || 
    claim.status === 'COMPLETED'
  );
  if (isPaid) {
    return claim;
  }

  // Extract author list from metadata
  let rawAuthors = Array.isArray(claim.metadata?.authors) && claim.metadata.authors.length > 0
    ? claim.metadata.authors
    : [];

  if (rawAuthors.length === 0 && Array.isArray(claim.metadata?.coAuthors) && claim.metadata.coAuthors.length > 0) {
    rawAuthors = [
      { name: claim.applicantName, department: claim.department, employeeId: '', isMmdu: true },
      ...claim.metadata.coAuthors.map(ca => typeof ca === 'string' ? { employeeId: ca, isMmdu: true } : ca)
    ];
  }

  if (rawAuthors.length === 0) {
    rawAuthors = [{ name: claim.applicantName, department: claim.department, employeeId: '', isMmdu: true }];
  }

  const totalAuthors = Math.max(1, rawAuthors.length);

  const checkIsMmdu = (a) => {
    if (!a) return false;
    if (a.isMmdu === false || a.isMmdu === 'no' || String(a.isMmdu).toLowerCase() === 'false') return false;
    const inst = String(a.institution || a.affiliation || a.university || '').toLowerCase();
    if (inst && (inst.includes('external') || inst.includes('other')) && !inst.includes('mmdu') && !inst.includes('maharishi markandeshwar')) {
      return false;
    }
    return true;
  };

  const condition = claim.policySnapshot?.condition || (determineCondition ? determineCondition(claim) : 'Q1_SCI_SCIE');
  const baseRuleIncentive = claim.totalIncentive || claim.calculatedAmount || 0;

  let inactiveUnpaidPool = 0;

  // Resolve status and evaluate eligibility for each author
  const evaluatedAuthors = await Promise.all(
    rawAuthors.map(async (author) => {
      const isMmdu = checkIsMmdu(author);
      if (!isMmdu) {
        return {
          name: author.name || 'External Author',
          employeeId: author.employeeId || author.id || '',
          department: author.department || 'External',
          institution: author.institution || 'External',
          isMmdu: false,
          isActive: false,
          eligibleIncentive: 0,
          authorShare: 0
        };
      }

      let isActive = true;
      let userDoc = null;
      const cleanEmpId = (author.employeeId || author.id || '').trim();
      const cleanEmail = (author.email || '').trim().toLowerCase();
      const cleanName = (author.name || '').trim();

      if (author.isActive === false || author.status === 'inactive' || author.isInactive === true) {
        isActive = false;
      } else {
        if (cleanEmpId) {
          userDoc = await User.findOne({ employeeId: cleanEmpId }).select('isActive name department employeeId').lean();
        }
        if (!userDoc && cleanEmail) {
          userDoc = await User.findOne({ email: cleanEmail }).select('isActive name department employeeId').lean();
        }
        if (!userDoc && cleanName) {
          userDoc = await User.findOne({ name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }).select('isActive name department employeeId').lean();
        }
        if (!userDoc && claim.applicant) {
          userDoc = await User.findById(claim.applicant).select('isActive name department employeeId').lean();
        }

        if (userDoc && userDoc.isActive === false) {
          isActive = false;
        }
      }

      const authorObj = {
        name: userDoc?.name || author.name || claim.applicantName || 'Author',
        employeeId: userDoc?.employeeId || author.employeeId || author.id || '',
        department: userDoc?.department || author.department || claim.department,
        institution: 'MMDU',
        isMmdu: true,
        isActive
      };

      // Calculate individual author eligibility
      const eligibleIncentive = await getAuthorEligibleIncentive(authorObj, claim, condition, baseRuleIncentive);
      // Author's Share = Eligible Incentive / Total Authors
      const rawShare = eligibleIncentive > 0 ? (eligibleIncentive / totalAuthors) : 0;
      const authorShare = Math.round(rawShare * 100) / 100;

      if (!isActive) {
        if (authorShare > 0) {
          inactiveUnpaidPool += authorShare;
        }
        authorObj.eligibleIncentive = eligibleIncentive;
        authorObj.authorShare = 0;
        return authorObj;
      }

      authorObj.eligibleIncentive = eligibleIncentive;
      authorObj.authorShare = authorShare;
      return authorObj;
    })
  );

  // Redistribute unpaid share of inactive MMDU authors among remaining active MMDU authors
  const activeMmduAuthors = evaluatedAuthors.filter(a => a.isMmdu && a.isActive);
  if (activeMmduAuthors.length > 0 && inactiveUnpaidPool > 0) {
    const redisShare = Math.round((inactiveUnpaidPool / activeMmduAuthors.length) * 100) / 100;
    evaluatedAuthors.forEach(a => {
      if (a.isMmdu && a.isActive) {
        a.authorShare = Math.round((a.authorShare + redisShare) * 100) / 100;
      }
    });
  }

  const authorPayments = evaluatedAuthors.map(item => ({
    name: item.name,
    employeeId: item.employeeId,
    department: item.department,
    institution: item.institution,
    isMmdu: item.isMmdu,
    isActive: item.isActive,
    payableAmount: item.authorShare,
    paymentStatus: 'HELD'
  }));

  const totalDistributedIncentive = authorPayments.reduce((acc, p) => acc + p.payableAmount, 0);

  const matchedSubmitter = authorPayments.find(p =>
    (claim.applicantName && p.name.toLowerCase().includes(claim.applicantName.toLowerCase()))
  ) || authorPayments[0];

  const submitterShare = matchedSubmitter ? matchedSubmitter.payableAmount : 0;

  claim.totalIncentive = totalDistributedIncentive;
  claim.mmduAuthorCount = totalAuthors;
  claim.individualShare = submitterShare;
  claim.authorPayments = authorPayments;
  if (claim.approvedAmount > 0 || claim.calculatedAmount > 0) {
    claim.approvedAmount = submitterShare;
    claim.calculatedAmount = submitterShare;
  }

  return claim;
};
