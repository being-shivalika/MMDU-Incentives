import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import * as transactionService from '../services/transactionService.js';

export const listTransactions = asyncHandler(async (req, res) => {
  const filters = {
    paymentStatus: req.query.paymentStatus,
    financialYear: req.query.financialYear,
    search: req.query.search
  };
  const pagination = { page: req.query.page, limit: req.query.limit };
  const result = await transactionService.listTransactions(filters, pagination);
  return successResponse(res, 'Transactions retrieved', result);
});

export const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionByClaim(req.params.id);
  // If param is transactionId not claimId, try finding directly
  if (!transaction) {
    const Transaction = (await import('../models/Transaction.js')).default;
    const txn = await Transaction.findById(req.params.id)
      .populate('applicant', 'name email department')
      .populate('claim', 'claimNumber title category status')
      .populate('processedBy', 'name role');
    if (!txn) return errorResponse(res, 'Transaction not found', null, 404);
    return successResponse(res, 'Transaction retrieved', txn);
  }
  return successResponse(res, 'Transaction retrieved', transaction);
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const { utrNumber, billNumber, paidAmount, paymentDate, remarks } = req.body;
  const transaction = await transactionService.completePayment(
    req.params.id,
    { utrNumber, billNumber, paidAmount, paymentDate, remarks },
    req.user._id
  );
  return successResponse(res, 'Transaction updated', transaction);
});

export const getTransactionByClaim = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionByClaim(req.params.claimId);
  if (!transaction) return errorResponse(res, 'No transaction found for this claim', null, 404);
  return successResponse(res, 'Transaction retrieved', transaction);
});
