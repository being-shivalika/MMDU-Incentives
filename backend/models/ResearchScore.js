import mongoose from 'mongoose';

const researchScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  financialYear: { type: String, required: true },
  claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true },
  category: { type: String },
  subtype: { type: String },
  scorePoints: { type: Number, required: true },
  calculationBasis: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

researchScoreSchema.index({ user: 1, financialYear: 1 });

researchScoreSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const ResearchScore = mongoose.model('ResearchScore', researchScoreSchema);
export default ResearchScore;
