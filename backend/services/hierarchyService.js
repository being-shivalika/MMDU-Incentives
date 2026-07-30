import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Determine the effective approver role and user for a given department.
 * Implements official fallback hierarchy: HOD -> Principal -> Director.
 * 
 * Rules:
 * 1. If HOD exists in department: HOD is the effective approver. Principal & Director are view-only.
 * 2. If NO HOD exists: Principal automatically receives HOD approval authority. Director is view-only.
 * 3. If NO HOD AND NO Principal exist: Director automatically receives approval authority.
 * 
 * @param {string} department 
 * @param {string} institute 
 * @returns {Object} { role, label, isFallback, fallbackReason, approverUser }
 */
export const getEffectiveApprover = async (department, institute = 'MMDU') => {
  try {
    // 1. Check for active HOD in the department
    if (department) {
      const hodUser = await User.findOne({
        role: 'hod',
        department: { $regex: new RegExp(`^${department.trim()}$`, 'i') },
        isActive: true
      });

      if (hodUser) {
        return {
          role: 'hod',
          label: 'HOD',
          isFallback: false,
          fallbackReason: null,
          approverUser: hodUser
        };
      }
    }

    // 2. Fallback: Check for active Principal
    const principalUser = await User.findOne({
      role: 'principal',
      isActive: true
    });

    if (principalUser) {
      return {
        role: 'principal',
        label: 'Principal (Automatic Fallback)',
        isFallback: true,
        fallbackReason: 'No HOD configured for department. Authority automatically routed to Principal.',
        approverUser: principalUser
      };
    }

    // 3. Second Fallback: Check for active Director
    const directorUser = await User.findOne({
      role: 'director',
      isActive: true
    });

    if (directorUser) {
      return {
        role: 'director',
        label: 'Director (Automatic Fallback)',
        isFallback: true,
        fallbackReason: 'No HOD or Principal configured for department. Authority automatically routed to Director.',
        approverUser: directorUser
      };
    }

    // Default fallback if database records are empty
    return {
      role: 'principal',
      label: 'Principal (Default)',
      isFallback: true,
      fallbackReason: 'Default hierarchy fallback.',
      approverUser: null
    };
  } catch (error) {
    logger.error('Error determining effective approver:', error.message);
    return {
      role: 'hod',
      label: 'HOD',
      isFallback: false,
      fallbackReason: null,
      approverUser: null
    };
  }
};

/**
 * Calculate dynamic permissions for a user acting on a claim.
 * @param {Object} claim 
 * @param {Object} user 
 * @returns {Object} permissions
 */
export const getClaimPermissions = async (claim, user) => {
  if (!user || !claim) {
    return {
      canApprove: false,
      canReject: false,
      canReturn: false,
      canConfirmPayment: false,
      canReleasePayment: false,
      canEdit: false,
      canSubmit: false,
      canDelete: false,
      isEffectiveApprover: false,
      effectiveApproverRole: null,
      effectiveApproverLabel: null
    };
  }

  const userId = user._id ? user._id.toString() : user.id;
  const applicantId = claim.applicant ? claim.applicant.toString() : (claim.creatorId ? claim.creatorId.toString() : null);
  const isApplicant = userId === applicantId;
  const isAdmin = user.role === 'admin';

  const effectiveApprover = await getEffectiveApprover(claim.department, claim.institute);
  const status = claim.status;

  let canApprove = false;
  let canReject = false;
  let canReturn = false;
  let canConfirmPayment = false;
  let canReleasePayment = false;
  let canEdit = false;
  let canSubmit = false;
  let canDelete = false;
  let isEffectiveApprover = false;

  // 1. Applicant actions
  if (isApplicant) {
    if (status === 'DRAFT') {
      canEdit = true;
      canSubmit = true;
      canDelete = true;
    } else if (status === 'RETURNED') {
      canEdit = true;
      canSubmit = true;
    }
  }

  // 2. Department Approval Stage ('DEPARTMENT_REVIEW')
  if (status === 'DEPARTMENT_REVIEW') {
    if (user.role === effectiveApprover.role || isAdmin) {
      canApprove = true;
      canReject = true;
      canReturn = true;
      isEffectiveApprover = true;
    }
    // Principal & Director are view-only when HOD exists and user is not effective approver
  }

  // 3. RPC Verification Stage ('RPC_VERIFICATION')
  if (status === 'RPC_VERIFICATION') {
    if (['rpc_cell', 'rd_cell', 'admin'].includes(user.role)) {
      canApprove = true;
      canReject = true;
      canReturn = true;
      isEffectiveApprover = true;
    }
  }

  // 4. Accounts Processing Stage ('ACCOUNTS_PROCESSING')
  if (status === 'ACCOUNTS_PROCESSING') {
    if (['accounts', 'admin'].includes(user.role)) {
      canConfirmPayment = true;
      canReleasePayment = true;
      canReturn = true;
      isEffectiveApprover = true;
    }
  }

  return {
    canApprove,
    canReject,
    canReturn,
    canConfirmPayment,
    canReleasePayment,
    canEdit,
    canSubmit,
    canDelete,
    isEffectiveApprover,
    effectiveApproverRole: effectiveApprover.role,
    effectiveApproverLabel: effectiveApprover.label,
    fallbackReason: effectiveApprover.fallbackReason
  };
};
