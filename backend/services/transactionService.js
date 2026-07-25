import Transaction from '../models/Transaction.js';
import { generateVoucherNumber, generateSanctionNumber } from './counterService.js';
import { createAuditLog } from './auditService.js';
import { AUDIT_ACTIONS } from '../constants/auditActions.js';
import logger from '../utils/logger.js';

/**
 * Create a transaction record when RPC approves incentive.
 */
export const createTransaction = async (claim, processedBy) => {
  const voucherNumber = await generateVoucherNumber();
  const sanctionNumber = await generateSanctionNumber();
  
  const transaction = await Transaction.create({
    claim: claim._id,
    applicant: claim.applicant,
    financialYear: claim.financialYear,
    currency: 'INR',
    calculatedAmount: claim.calculatedAmount,
    approvedAmount: claim.approvedAmount || claim.calculatedAmount,
    voucherNumber,
    sanctionNumber,
    paymentStatus: 'pending',
    processedBy,
    remarks: 'Transaction created upon incentive approval.',
    transactionHistory: [{
      status: 'pending',
      amount: claim.calculatedAmount,
      changedBy: processedBy,
      remarks: 'Transaction initiated.',
      date: new Date()
    }]
  });
  
  await createAuditLog({
    action: AUDIT_ACTIONS.PAYMENT_CREATED,
    entity: 'Transaction',
    entityId: transaction._id,
    performedBy: processedBy,
    details: { claimNumber: claim.claimNumber, amount: claim.calculatedAmount, voucherNumber }
  });
  
  return transaction;
};

/**
 * Process payment release (Accounts action).
 */
export const releasePayment = async (claim, amount, processedBy, remarks) => {
  let transaction = await Transaction.findOne({ claim: claim._id });
  
  if (!transaction) {
    // Create if doesn't exist
    transaction = await createTransaction(claim, processedBy);
  }
  
  transaction.releasedAmount = amount;
  transaction.paymentStatus = 'processing';
  transaction.processedBy = processedBy;
  transaction.remarks = remarks || 'Payment released for processing.';
  transaction.transactionHistory.push({
    status: 'processing',
    amount,
    changedBy: processedBy,
    remarks: remarks || 'Payment released.',
    date: new Date()
  });
  
  await transaction.save();
  
  await createAuditLog({
    action: AUDIT_ACTIONS.PAYMENT_RELEASED,
    entity: 'Transaction',
    entityId: transaction._id,
    performedBy: processedBy,
    details: { amount, voucherNumber: transaction.voucherNumber }
  });
  
  return transaction;
};

/**
 * Complete payment (update UTR, mark as completed).
 */
export const completePayment = async (transactionId, { utrNumber, billNumber, paidAmount, paymentDate, remarks }, processedBy) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.statusCode = 404;
    throw error;
  }
  
  transaction.utrNumber = utrNumber;
  if (billNumber) transaction.billNumber = billNumber;
  transaction.paidAmount = paidAmount || transaction.releasedAmount;
  transaction.paymentDate = paymentDate || new Date();
  transaction.paymentStatus = 'completed';
  transaction.remarks = remarks || 'Payment completed.';
  transaction.transactionHistory.push({
    status: 'completed',
    amount: transaction.paidAmount,
    changedBy: processedBy,
    remarks: `UTR: ${utrNumber}. ${remarks || ''}`,
    date: new Date()
  });
  
  await transaction.save();
  
  // Also update claim's paidAmount
  const Claim = (await import('../models/Claim.js')).default;
  await Claim.findByIdAndUpdate(transaction.claim, { paidAmount: transaction.paidAmount });
  
  await createAuditLog({
    action: AUDIT_ACTIONS.PAYMENT_COMPLETED,
    entity: 'Transaction',
    entityId: transaction._id,
    performedBy: processedBy,
    details: { utrNumber, paidAmount: transaction.paidAmount }
  });
  
  return transaction;
};

/**
 * Get transaction by claim ID.
 */
export const getTransactionByClaim = async (claimId) => {
  return Transaction.findOne({ claim: claimId })
    .populate('applicant', 'name email department')
    .populate('processedBy', 'name email role');
};

/**
 * List transactions with filters and pagination.
 */
export const listTransactions = async (filters = {}, pagination = {}) => {
  const { paymentStatus, financialYear, search } = filters;
  const { page = 1, limit = 20 } = pagination;
  
  const query = {};
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (financialYear) query.financialYear = financialYear;
  if (search) {
    query.$or = [
      { voucherNumber: { $regex: search, $options: 'i' } },
      { utrNumber: { $regex: search, $options: 'i' } },
      { sanctionNumber: { $regex: search, $options: 'i' } }
    ];
  }
  
  const total = await Transaction.countDocuments(query);
  const transactions = await Transaction.find(query)
    .populate('applicant', 'name email department')
    .populate('claim', 'claimNumber title category status')
    .populate('processedBy', 'name role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  
  return {
    transactions,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
};
