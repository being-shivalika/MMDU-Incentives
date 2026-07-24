import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import ClaimDocument from '../models/ClaimDocument.js';
import Claim from '../models/Claim.js';
import * as storageService from '../services/storageService.js';
import { createAuditLog } from '../services/auditService.js';
import { AUDIT_ACTIONS } from '../constants/auditActions.js';

export const uploadDocument = asyncHandler(async (req, res) => {
  const { claimId } = req.params;
  const claim = await Claim.findById(claimId);
  if (!claim) return errorResponse(res, 'Claim not found', null, 404);
  
  // Only owner can upload
  if (claim.applicant.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'You can only upload documents to your own claims', null, 403);
  }
  
  if (!req.file) return errorResponse(res, 'No file uploaded', null, 400);
  
  // Move file to organized storage
  const fileInfo = storageService.uploadFile(req.file, claim.financialYear, claim.claimNumber);
  
  const document = await ClaimDocument.create({
    claim: claimId,
    uploadedBy: req.user._id,
    originalName: fileInfo.originalName,
    fileName: fileInfo.fileName,
    filePath: fileInfo.filePath,
    fileSize: fileInfo.fileSize,
    mimeType: fileInfo.mimeType,
    documentType: req.body.documentType || 'general',
    financialYear: claim.financialYear
  });
  
  await createAuditLog({
    action: AUDIT_ACTIONS.DOCUMENT_UPLOADED,
    entity: 'ClaimDocument',
    entityId: document._id,
    performedBy: req.user._id,
    details: { claimNumber: claim.claimNumber, fileName: fileInfo.originalName },
    ipAddress: req.ip
  });
  
  return successResponse(res, 'Document uploaded successfully', document, 201);
});

export const getClaimDocuments = asyncHandler(async (req, res) => {
  const documents = await ClaimDocument.find({ claim: req.params.claimId })
    .populate('uploadedBy', 'name')
    .sort({ createdAt: -1 });
  return successResponse(res, 'Documents retrieved', documents);
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await ClaimDocument.findById(req.params.documentId);
  if (!document) return errorResponse(res, 'Document not found', null, 404);
  
  if (document.uploadedBy.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'You can only delete your own documents', null, 403);
  }
  
  storageService.deleteFile(document.filePath);
  await ClaimDocument.findByIdAndDelete(req.params.documentId);
  
  await createAuditLog({
    action: AUDIT_ACTIONS.DOCUMENT_DELETED,
    entity: 'ClaimDocument',
    entityId: document._id,
    performedBy: req.user._id,
    details: { fileName: document.originalName },
    ipAddress: req.ip
  });
  
  return successResponse(res, 'Document deleted successfully');
});
