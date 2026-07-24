import ResearchScore from '../models/ResearchScore.js';
import logger from '../utils/logger.js';

/**
 * Calculate and store research score for a claim.
 * Called after policy engine calculates incentive.
 */
export const calculateAndStoreScore = async (claim, policyResult) => {
  try {
    // Check if score already exists for this claim
    const existing = await ResearchScore.findOne({ claim: claim._id });
    if (existing) {
      logger.info(`Research score already exists for claim ${claim.claimNumber}`);
      return existing;
    }
    
    const score = await ResearchScore.create({
      user: claim.applicant,
      financialYear: claim.financialYear,
      claim: claim._id,
      category: claim.category,
      subtype: claim.subtype,
      scorePoints: policyResult.scorePoints || 0,
      calculationBasis: policyResult.policySnapshot
    });
    
    return score;
  } catch (error) {
    logger.error('Failed to store research score:', error.message);
    return null;
  }
};

/**
 * Get total research score for a user in a financial year.
 */
export const getUserScore = async (userId, financialYear) => {
  const result = await ResearchScore.aggregate([
    { $match: { user: userId, financialYear } },
    { $group: { _id: null, totalScore: { $sum: '$scorePoints' }, claimCount: { $sum: 1 } } }
  ]);
  return result[0] || { totalScore: 0, claimCount: 0 };
};

/**
 * Get research score breakdown for a user.
 */
export const getUserScoreBreakdown = async (userId, financialYear) => {
  return ResearchScore.find({ user: userId, financialYear })
    .populate('claim', 'claimNumber title category subtype')
    .sort({ createdAt: -1 });
};

/**
 * Get department/university leaderboard.
 */
export const getLeaderboard = async (financialYear, limit = 20) => {
  return ResearchScore.aggregate([
    { $match: { financialYear } },
    { $group: { _id: '$user', totalScore: { $sum: '$scorePoints' }, claimCount: { $sum: 1 } } },
    { $sort: { totalScore: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$_id', name: '$user.name', department: '$user.department', designation: '$user.designation', totalScore: 1, claimCount: 1 } }
  ]);
};
