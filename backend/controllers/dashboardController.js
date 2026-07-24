import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import Claim from '../models/Claim.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { CLAIM_STATUSES } from '../constants/claimStatuses.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const user = req.user;
  let stats = {};
  
  if (user.role === 'faculty' || user.role === 'student') {
    const baseQuery = { applicant: user._id };
    const [total, pending, approved, returned, rejected] = await Promise.all([
      Claim.countDocuments(baseQuery),
      Claim.countDocuments({ ...baseQuery, status: { $in: ['DEPARTMENT_REVIEW', 'PRINCIPAL_REVIEW', 'RPC_VERIFICATION', 'ACCOUNTS_PROCESSING'] } }),
      Claim.countDocuments({ ...baseQuery, status: CLAIM_STATUSES.COMPLETED }),
      Claim.countDocuments({ ...baseQuery, status: CLAIM_STATUSES.RETURNED }),
      Claim.countDocuments({ ...baseQuery, status: CLAIM_STATUSES.REJECTED })
    ]);
    
    const incentiveResult = await Claim.aggregate([
      { $match: { applicant: user._id, status: CLAIM_STATUSES.COMPLETED } },
      { $group: { _id: null, total: { $sum: '$releasedAmount' } } }
    ]);
    
    stats = {
      totalSubmissions: total,
      pendingReview: pending,
      approved,
      returned,
      rejected,
      totalIncentive: incentiveResult[0]?.total || 0,
      currency: 'INR'
    };
  } else if (user.role === 'hod') {
    const deptQuery = { department: user.department };
    const [queueCount, forwardedCount, returnedCount] = await Promise.all([
      Claim.countDocuments({ ...deptQuery, status: CLAIM_STATUSES.DEPARTMENT_REVIEW }),
      Claim.countDocuments({ ...deptQuery, status: { $in: ['PRINCIPAL_REVIEW', 'RPC_VERIFICATION', 'ACCOUNTS_PROCESSING', 'COMPLETED'] } }),
      Claim.countDocuments({ ...deptQuery, status: CLAIM_STATUSES.RETURNED })
    ]);
    stats = { queueCount, forwardedCount, returnedCount };
  } else if (user.role === 'principal') {
    stats = {
      queueCount: await Claim.countDocuments({ status: CLAIM_STATUSES.PRINCIPAL_REVIEW })
    };
  } else if (user.role === 'director' || user.role === 'rpc_cell' || user.role === 'rd_cell') {
    stats = {
      queueCount: await Claim.countDocuments({ status: CLAIM_STATUSES.RPC_VERIFICATION })
    };
  } else if (user.role === 'accounts') {
    const [pendingPayments, completedPayments] = await Promise.all([
      Claim.countDocuments({ status: CLAIM_STATUSES.ACCOUNTS_PROCESSING }),
      Transaction.countDocuments({ paymentStatus: 'completed' })
    ]);
    const disbursedResult = await Transaction.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]);
    stats = {
      pendingPayments,
      completedPayments,
      totalDisbursed: disbursedResult[0]?.total || 0,
      currency: 'INR'
    };
  } else if (user.role === 'admin') {
    const [totalUsers, totalClaims, totalCompleted] = await Promise.all([
      User.countDocuments(),
      Claim.countDocuments(),
      Claim.countDocuments({ status: CLAIM_STATUSES.COMPLETED })
    ]);
    stats = { totalUsers, totalClaims, totalCompleted };
  } else {
    stats = { message: 'Dashboard stats not configured for this role' };
  }
  
  return successResponse(res, 'Dashboard stats retrieved', stats);
});

export const getRecentSubmissions = asyncHandler(async (req, res) => {
  const user = req.user;
  const limit = parseInt(req.query.limit) || 5;
  
  let query = {};
  if (user.role === 'faculty' || user.role === 'student') {
    query.applicant = user._id;
  } else if (user.role === 'hod') {
    query.department = user.department;
  }
  // Other roles see all recent claims
  
  const claims = await Claim.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('claimNumber title category subtype status applicantName department createdAt financialYear');
  
  return successResponse(res, 'Recent submissions retrieved', claims);
});

export const getChartData = asyncHandler(async (req, res) => {
  const user = req.user;
  const months = parseInt(req.query.months) || 6;
  
  let matchQuery = {};
  if (user.role === 'faculty' || user.role === 'student') {
    matchQuery.applicant = user._id;
  } else if (user.role === 'hod') {
    matchQuery.department = user.department;
  }
  
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  matchQuery.createdAt = { $gte: startDate };
  
  const data = await Claim.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  
  const chartData = data.map(d => ({
    month: `${d._id.year}-${String(d._id.month).padStart(2, '0')}`,
    submissions: d.count
  }));
  
  return successResponse(res, 'Chart data retrieved', chartData);
});
