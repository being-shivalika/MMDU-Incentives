import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  // Identity
  claimNumber: { type: String, unique: true, index: true },
  
  // Applicant (denormalized for query performance)
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  applicantName: { type: String, required: true },
  department: { type: String, required: true, index: true },
  institute: { type: String, default: 'MMDU' },
  applicantRole: { type: String, enum: ['faculty', 'student'], required: true },
  
  // Classification
  category: { type: String, required: true },
  subtype: { type: String, required: true },
  title: { type: String, required: true },
  
  // Dynamic metadata (schema-specific fields)
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // Workflow
  status: { type: String, required: true, default: 'DRAFT', index: true,
    enum: ['DRAFT', 'DEPARTMENT_REVIEW', 'PRINCIPAL_REVIEW', 'RPC_VERIFICATION', 'ACCOUNTS_PROCESSING', 'COMPLETED', 'RETURNED', 'REJECTED'] },
  currentDesk: { type: String },
  
  // Financial Year
  financialYear: { type: String, required: true, index: true },
  submissionDate: { type: Date },
  
  // Financial (NEVER overwrite - all in INR)
  calculatedAmount: { type: Number, default: 0 },
  approvedAmount: { type: Number, default: 0 },
  releasedAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  
  // Policy snapshot
  policySnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
  researchScore: { type: Number, default: 0 },
  isDuplicate: { type: Boolean, default: false },
  
  // Workflow progress (computed server-side for frontend)
  workflowProgress: {
    currentStage: String,
    currentStep: Number,
    totalSteps: Number,
    percentage: Number,
    statusLabel: String,
    isRejected: Boolean,
    isReturned: Boolean,
    completedStages: [String],
    pendingStages: [String]
  }
}, { timestamps: true });

// Compound indexes
claimSchema.index({ category: 1, subtype: 1 });
claimSchema.index({ 'metadata.doi': 1 }, { sparse: true });
claimSchema.index({ createdAt: -1 });

// Virtual: alias _id as id
claimSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
