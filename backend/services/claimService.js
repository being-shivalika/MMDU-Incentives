import Claim from '../models/Claim.js';
import ApprovalHistory from '../models/ApprovalHistory.js';
import User from '../models/User.js';
import { generateClaimNumber } from './counterService.js';
import FinancialYear from '../models/FinancialYear.js';
import { checkDuplicateDOI, checkDuplicateSubmission, calculateIncentive, syncApplicantQ3Q4Claims } from './policyEngine.js';
import { createAuditLog } from './auditService.js';
import { AUDIT_ACTIONS } from '../constants/auditActions.js';
import { CLAIM_STATUSES } from '../constants/claimStatuses.js';
import logger from '../utils/logger.js';

/**
 * Get the current financial year label.
 */
export const getCurrentFinancialYear = async () => {
  const fy = await FinancialYear.findOne({ isCurrent: true, isActive: true });
  if (!fy) {
    // Fallback: calculate from current date
    const now = new Date();
    const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-${String(year + 1).slice(2)}`;
  }
  return fy.label;
};

/**
 * Create a new claim.
 */
export const createClaim = async (claimData, user, ipAddress) => {
  const claimNumber = await generateClaimNumber();
  const financialYear = await getCurrentFinancialYear();
  
  // Comprehensive duplicate check (DOI, Scopus Link, Verification Links, Title)
  const dupCheck = await checkDuplicateSubmission(claimData);
  if (dupCheck.isDuplicate) {
    const error = new Error(dupCheck.reason);
    error.statusCode = 400;
    throw error;
  }
  
  const isDraft = claimData.status === 'DRAFT';
  
  if (!isDraft) {
    const title = claimData.metadata?.title || claimData.title;
    if (!title || !title.trim() || title === 'Untitled Claim') {
      const error = new Error('Title is required for submission');
      error.statusCode = 400;
      throw error;
    }
    const domain = claimData.metadata?.domain || claimData.domain;
    if (!domain || !domain.trim()) {
      const error = new Error('Research Area / Domain is required for submission');
      error.statusCode = 400;
      throw error;
    }
    const firstVer = claimData.metadata?.firstVerification || claimData.firstVerification;
    if (!firstVer || !firstVer.trim()) {
      const error = new Error('Verification detail #1 (e.g. DOI / ISBN / Reg No) is required');
      error.statusCode = 400;
      throw error;
    }
    const secondVer = claimData.metadata?.secondVerification || claimData.secondVerification;
    if (!secondVer || !secondVer.trim()) {
      const error = new Error('Verification detail #2 (e.g. Scopus Link / Certificate Link) is required');
      error.statusCode = 400;
      throw error;
    }
    const authors = claimData.metadata?.authors || [];
    if (Array.isArray(authors) && authors.length > 15) {
      const error = new Error('Maximum limit of 15 authors allowed per submission');
      error.statusCode = 400;
      throw error;
    }
  }
  
  const claim = new Claim({
    claimNumber,
    applicant: user._id,
    applicantName: user.name,
    department: user.department,
    institute: user.institute || 'MMDU',
    applicantRole: user.role,
    category: claimData.category || getCategory(claimData.typeId),
    subtype: claimData.subtype || claimData.typeId,
    title: claimData.metadata?.title || claimData.title || 'Untitled Claim',
    metadata: claimData.metadata || {},
    status: isDraft ? CLAIM_STATUSES.DRAFT : CLAIM_STATUSES.DEPARTMENT_REVIEW,
    currentDesk: isDraft ? 'faculty' : 'hod',
    financialYear,
    submissionDate: isDraft ? null : new Date()
  });

  const policyResult = await calculateIncentive(claim);
  claim.totalIncentive = policyResult.totalIncentive || policyResult.amount || 0;
  claim.mmduAuthorCount = policyResult.mmduAuthorCount || 1;
  claim.individualShare = policyResult.individualShare || policyResult.amount || 0;
  claim.authorPayments = policyResult.authorPayments || [];
  claim.calculatedAmount = policyResult.amount || 0;
  claim.approvedAmount = policyResult.amount || 0;
  claim.policySnapshot = policyResult.policySnapshot;
  claim.researchScore = policyResult.scorePoints || 0;

  await claim.save();

  if (!isDraft) {
    await syncApplicantQ3Q4Claims(user._id, financialYear);
  }
  
  // Create initial approval history for official submissions only
  if (!isDraft) {
    await ApprovalHistory.create({
      claim: claim._id,
      step: 'Submitted',
      action: 'SUBMIT_CLAIM',
      fromStatus: 'NEW',
      toStatus: claim.status,
      actionBy: user._id,
      actionByName: user.name,
      actionByRole: user.role,
      remarks: 'Claim submitted for review.',
      date: new Date()
    });
  }
  
  // Audit log
  await createAuditLog({
    action: isDraft ? AUDIT_ACTIONS.CLAIM_CREATED : AUDIT_ACTIONS.CLAIM_SUBMITTED,
    entity: 'Claim',
    entityId: claim._id,
    performedBy: user._id,
    details: { claimNumber, category: claim.category, subtype: claim.subtype },
    ipAddress
  });
  
  return claim;
};

/**
 * Helper to derive category from typeId.
 */
const getCategory = (typeId) => {
  const categoryMap = {
    journal: 'research_publications',
    conference: 'research_publications',
    book: 'books_chapters',
    book_chapter: 'books_chapters',
    book_section: 'books_chapters',
    book_chapter_vol: 'books_chapters',
    edited_book: 'books_chapters',
    patent: 'intellectual_property',
    patent_filed: 'intellectual_property',
    patent_published: 'intellectual_property',
    patent_granted: 'intellectual_property',
    copyright: 'intellectual_property',
    design_registration: 'intellectual_property',
    startup: 'innovation_projects',
    startup_registered: 'innovation_projects',
    startup_incubated: 'innovation_projects',
    startup_commercialized: 'innovation_projects',
    consultancy: 'innovation_projects',
    funded_project: 'innovation_projects',
    tech_transfer: 'innovation_projects',
    research_award: 'recognition_awards'
  };
  return categoryMap[typeId] || 'research_publications';
};

/**
 * Update a claim (only DRAFT or RETURNED status).
 */
export const updateClaim = async (claimId, updateData, user, ipAddress) => {
  const claim = await Claim.findById(claimId);
  if (!claim) {
    const error = new Error('Claim not found');
    error.statusCode = 404;
    throw error;
  }
  
  const isAdmin = user && user.role === 'admin';
  if (!isAdmin) {
    // Only allow updates in DRAFT or RETURNED for non-admins
    if (![CLAIM_STATUSES.DRAFT, CLAIM_STATUSES.RETURNED].includes(claim.status)) {
      const error = new Error('Claim can only be updated in DRAFT or RETURNED status');
      error.statusCode = 400;
      throw error;
    }
    
    // Only allow owner to update for non-admins
    if (claim.applicant.toString() !== user._id.toString()) {
      const error = new Error('You can only update your own claims');
      error.statusCode = 403;
      throw error;
    }
  }
  
  // Check duplicate submission if metadata/title changed
  const dupCheck = await checkDuplicateSubmission(updateData, claim._id);
  if (dupCheck.isDuplicate) {
    const error = new Error(dupCheck.reason);
    error.statusCode = 400;
    throw error;
  }
  
  // Determine if this is a resubmission
  const isResubmit = claim.status === CLAIM_STATUSES.RETURNED && 
                     updateData.status === CLAIM_STATUSES.DEPARTMENT_REVIEW;
  
  // Update fields
  if (updateData.metadata) claim.metadata = updateData.metadata;
  if (updateData.title) claim.title = updateData.title;
  if (updateData.metadata?.title) claim.title = updateData.metadata.title;
  if (updateData.typeId) {
    claim.subtype = updateData.typeId;
    claim.category = getCategory(updateData.typeId);
  }
  
  if (isResubmit) {
    claim.status = CLAIM_STATUSES.DEPARTMENT_REVIEW;
    claim.currentDesk = 'hod';
    claim.submissionDate = claim.submissionDate || new Date();
    
    await ApprovalHistory.create({
      claim: claim._id,
      step: 'Resubmitted',
      action: 'RESUBMIT_CLAIM',
      fromStatus: CLAIM_STATUSES.RETURNED,
      toStatus: CLAIM_STATUSES.DEPARTMENT_REVIEW,
      actionBy: user._id,
      actionByName: user.name,
      actionByRole: user.role,
      remarks: 'Claim updated and resubmitted.',
      date: new Date()
    });
  } else if (updateData.status === CLAIM_STATUSES.DEPARTMENT_REVIEW && claim.status === CLAIM_STATUSES.DRAFT) {
    claim.status = CLAIM_STATUSES.DEPARTMENT_REVIEW;
    claim.currentDesk = 'hod';
    claim.submissionDate = new Date();
    
    await ApprovalHistory.create({
      claim: claim._id,
      step: 'Submitted',
      action: 'SUBMIT_CLAIM',
      fromStatus: CLAIM_STATUSES.DRAFT,
      toStatus: CLAIM_STATUSES.DEPARTMENT_REVIEW,
      actionBy: user._id,
      actionByName: user.name,
      actionByRole: user.role,
      remarks: 'Claim submitted from draft.',
      date: new Date()
    });
  }
  
  await claim.save();
  
  await createAuditLog({
    action: isResubmit ? AUDIT_ACTIONS.CLAIM_RESUBMITTED : AUDIT_ACTIONS.CLAIM_UPDATED,
    entity: 'Claim',
    entityId: claim._id,
    performedBy: user._id,
    details: { status: claim.status },
    ipAddress
  });
  
  return claim;
};

/**
 * Save claim as draft.
 */
export const saveDraft = async (claimId, draftData, user) => {
  const claim = await Claim.findById(claimId);
  if (!claim) {
    const error = new Error('Claim not found');
    error.statusCode = 404;
    throw error;
  }
  if (claim.status !== CLAIM_STATUSES.DRAFT) {
    const error = new Error('Only drafts can be saved');
    error.statusCode = 400;
    throw error;
  }
  if (claim.applicant.toString() !== user._id.toString()) {
    const error = new Error('You can only update your own claims');
    error.statusCode = 403;
    throw error;
  }
  
  if (draftData.metadata) claim.metadata = draftData.metadata;
  if (draftData.metadata?.title) claim.title = draftData.metadata.title;
  
  await claim.save();
  return claim;
};

/**
 * Get a claim by ID with full approval history.
 */
export const getClaimById = async (claimId, user = null) => {
  const claim = await Claim.findById(claimId);
  if (!claim) {
    const error = new Error('Claim not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (claim.status === CLAIM_STATUSES.DRAFT && user && user.role !== 'admin') {
    const isOwner = (claim.applicant && claim.applicant.toString() === user._id.toString()) ||
      (user.name && claim.applicantName && claim.applicantName.toLowerCase().trim() === user.name.toLowerCase().trim());
    if (!isOwner) {
      const error = new Error('Access denied to draft submission');
      error.statusCode = 403;
      throw error;
    }
  }

  const approvalHistory = await ApprovalHistory.find({ claim: claimId })
    .sort({ date: 1 });
  
  return { claim, approvalHistory };
};

/**
 * List claims with filtering, pagination, and sorting.
 */
export const listClaims = async (filters = {}, pagination = {}, user) => {
  const { status, category, creatorId, department, financialYear, search, sortBy = 'createdAt', order = 'desc' } = filters;
  const { page = 1, limit = 20 } = pagination;
  
  const query = {};
  
  // 1. Role-based Visibility Rules:
  // - Registrar & VC (and Admin, RPC, Accounts, Director): Sees submissions from all departments/institutes across the entire portal.
  // - HOD: Sees submissions ONLY from their own department.
  // - Principal:
  //     * If department HAS NO HOD (e.g. MCA): Sees submissions ONLY from their own department.
  //     * If department HAS AN HOD (e.g. MMEC): Sees submissions from the entire MMEC institute (CSE, IT, Software Eng, ECE, EE, ME, CE, Biotech, Physics, Chemistry, Math, Humanities).
  // - Faculty / Student: Sees only their own claims.

  if (user.role === 'faculty' || user.role === 'student') {
    query.$or = [
      { applicant: user._id },
      { applicantName: { $regex: new RegExp(`^${user.name.trim()}$`, 'i') } }
    ];
  } else if (user.role === 'hod') {
    if (user.department) {
      const cleanDept = user.department.trim();
      if (cleanDept.toLowerCase().includes('computer science') || cleanDept.toLowerCase().includes('cse')) {
        query.department = { $regex: /computer science|cse/i };
      } else {
        query.department = { $regex: new RegExp(`^${cleanDept}$`, 'i') };
      }
    }
  } else if (user.role === 'principal') {
    const userDept = user.department ? user.department.trim() : '';
    const isMcaDept = userDept && (userDept.toLowerCase().includes('mca') || userDept.toLowerCase().includes('computer applications'));
    
    // Check if user's department has an active HOD
    let hasHodInDept = false;
    if (userDept && !isMcaDept) {
      let deptQuery = { role: 'hod', isActive: true };
      if (userDept.toLowerCase().includes('computer science') || userDept.toLowerCase().includes('cse')) {
        deptQuery.department = { $regex: /computer science|cse/i };
      } else {
        deptQuery.department = { $regex: new RegExp(`^${userDept}$`, 'i') };
      }
      const hodUser = await User.findOne(deptQuery);
      if (hodUser) hasHodInDept = true;
    }

    if (!hasHodInDept) {
      // Department HAS NO HOD: Principal can view submissions ONLY from their own department
      if (userDept) {
        query.department = { $regex: new RegExp(`^${userDept}$`, 'i') };
      }
    } else {
      // Department HAS AN HOD (e.g. MMEC Principal): Principal views submissions from the entire MMEC institute
      const mmecDepts = [
        /computer science|cse/i,
        /information technology|\bit\b/i,
        /software engineering/i,
        /electronics & communication|ece/i,
        /electrical engineering|\bee\b/i,
        /mechanical engineering|\bme\b/i,
        /civil engineering|\bce\b/i,
        /biotechnology/i,
        /physics/i,
        /chemistry/i,
        /mathematics/i,
        /humanities/i
      ];
      query.$or = mmecDepts.map(d => ({ department: { $regex: d } }));
    }
  }
  // Registrar, VC, Admin, RPC, Accounts, Director: see submissions from all departments/institutes across the entire portal.

  // Apply filters
  if (status) query.status = status;
  if (category) query.category = category;
  if (creatorId) query.applicant = creatorId;
  if (department && user.role !== 'hod' && user.role !== 'principal') query.department = department;
  if (financialYear) query.financialYear = financialYear;
  
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    const searchCondition = [
      { title: searchRegex },
      { claimNumber: searchRegex },
      { applicantName: searchRegex },
      { category: searchRegex },
      { subtype: searchRegex },
      { department: searchRegex },
      { status: searchRegex }
    ];
    if (query.$or) {
      query.$and = query.$and || [];
      query.$and.push({ $or: searchCondition });
    } else {
      query.$or = searchCondition;
    }
  }

  // Ensure DRAFT claims are ONLY visible to their creator / applicant
  const isOwnerCondition = [
    { applicant: user._id },
    { applicantName: { $regex: new RegExp(`^${user.name.trim()}$`, 'i') } }
  ];

  query.$and = query.$and || [];
  query.$and.push({
    $or: [
      { status: { $ne: CLAIM_STATUSES.DRAFT } },
      ...isOwnerCondition
    ]
  });
  
  const sortObj = {};
  sortObj[sortBy] = order === 'asc' ? 1 : -1;
  
  const total = await Claim.countDocuments(query);
  const claims = await Claim.find(query)
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);
  
  return {
    claims,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
};

/**
 * Delete a draft claim.
 */
export const deleteDraft = async (claimId, user) => {
  const claim = await Claim.findById(claimId);
  if (!claim) {
    const error = new Error('Claim not found');
    error.statusCode = 404;
    throw error;
  }
  
  const isAdmin = user && user.role === 'admin';
  if (!isAdmin) {
    if (claim.status !== CLAIM_STATUSES.DRAFT) {
      const error = new Error('Only draft claims can be deleted');
      error.statusCode = 400;
      throw error;
    }
    if (claim.applicant && claim.applicant.toString() !== user._id.toString()) {
      const error = new Error('You can only delete your own claims');
      error.statusCode = 403;
      throw error;
    }
  }
  
  await ApprovalHistory.deleteMany({ claim: claimId });
  await Claim.findByIdAndDelete(claimId);
  
  return { message: 'Submission deleted successfully' };
};
