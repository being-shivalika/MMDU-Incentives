import User from '../models/User.js';

/**
 * Recalculates author incentive shares for a claim based on current MMDU author active/inactive status.
 * 
 * IMPORTANT SYSTEM RULE:
 * - If the claim has ALREADY been paid (isPaid === true OR status === 'COMPLETED'), the distribution is FROZEN.
 * - If the claim is UNPAID, inactive MMDU authors receive 0 INR and their share is redistributed equally among remaining ACTIVE MMDU authors.
 */
export const recalculateClaimAuthorShares = async (claim) => {
  if (!claim) return claim;

  // Freeze Rule: If already paid, do not recalculate or redistribute money.
  const isPaid = Boolean(
    claim.isPaid || 
    claim.paymentStatus === 'PAID' || 
    claim.status === 'COMPLETED'
  );
  if (isPaid) {
    return claim;
  }

  const totalIncentive = Number(claim.totalIncentive || claim.calculatedAmount || 0);
  if (totalIncentive <= 0) return claim;

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

  // Resolve active/inactive status of all authors from User collection
  const authorsWithStatus = await Promise.all(
    rawAuthors.map(async (author) => {
      const isMmdu = checkIsMmdu(author);
      if (!isMmdu) {
        return {
          name: author.name || 'External Author',
          employeeId: author.employeeId || author.id || '',
          department: author.department || 'External',
          institution: author.institution || 'External',
          isMmdu: false,
          isActive: false
        };
      }

      let isActive = true;
      if (author.isActive === false || author.status === 'inactive' || author.isInactive === true) {
        isActive = false;
      } else {
        let userDoc = null;
        const cleanEmpId = (author.employeeId || author.id || '').trim();
        const cleanEmail = (author.email || '').trim().toLowerCase();
        const cleanName = (author.name || '').trim();

        if (cleanEmpId) {
          userDoc = await User.findOne({ employeeId: cleanEmpId }).select('isActive').lean();
        }
        if (!userDoc && cleanEmail) {
          userDoc = await User.findOne({ email: cleanEmail }).select('isActive').lean();
        }
        if (!userDoc && cleanName) {
          userDoc = await User.findOne({ name: { $regex: new RegExp(`^${cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }).select('isActive').lean();
        }
        if (!userDoc && claim.applicant) {
          userDoc = await User.findById(claim.applicant).select('isActive').lean();
        }

        if (userDoc && userDoc.isActive === false) {
          isActive = false;
        }
      }

      return {
        name: author.name || 'Author',
        employeeId: author.employeeId || author.id || '',
        department: author.department || claim.department,
        institution: 'MMDU',
        isMmdu: true,
        isActive
      };
    })
  );

  const activeMmduAuthors = authorsWithStatus.filter(a => a.isMmdu && a.isActive);
  const activeCount = activeMmduAuthors.length;
  const totalMmduCount = authorsWithStatus.filter(a => a.isMmdu).length;

  // Redistribution calculation:
  // Inactive MMDU author share is released and split equally among remaining active MMDU authors
  const individualShare = activeCount > 0 ? Math.round(totalIncentive / activeCount) : 0;

  const authorPayments = authorsWithStatus.map(item => {
    const payableAmount = (item.isMmdu && item.isActive) ? individualShare : 0;
    return {
      name: item.name,
      employeeId: item.employeeId,
      department: item.department,
      institution: item.institution,
      isMmdu: item.isMmdu,
      isActive: item.isActive,
      payableAmount,
      paymentStatus: 'HELD'
    };
  });

  // Assign updated properties on claim object
  claim.mmduAuthorCount = activeCount > 0 ? activeCount : (totalMmduCount || 1);
  claim.individualShare = individualShare;
  claim.authorPayments = authorPayments;
  if (claim.approvedAmount > 0 || claim.calculatedAmount > 0) {
    claim.approvedAmount = individualShare;
  }

  return claim;
};
