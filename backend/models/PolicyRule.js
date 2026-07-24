import mongoose from 'mongoose';

const policyRuleSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subtype: { type: String, required: true },
  condition: { type: String, required: true },
  conditionLabel: { type: String },
  applicantType: { type: String, default: 'both', enum: ['faculty', 'student', 'both'] },
  incentiveAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  maxClaimsPerYear: { type: Number, default: 0 },
  maxAmountPerYear: { type: Number, default: 0 },
  multiAuthorRule: { type: String, default: 'divide_equally', enum: ['divide_equally', 'first_author_full', 'corresponding_author_full'] },
  scorePoints: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  effectiveFrom: { type: Date },
  effectiveTo: { type: Date },
  description: { type: String }
}, { timestamps: true });

policyRuleSchema.index({ category: 1, subtype: 1, condition: 1, isActive: 1 });

policyRuleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const PolicyRule = mongoose.model('PolicyRule', policyRuleSchema);
export default PolicyRule;
