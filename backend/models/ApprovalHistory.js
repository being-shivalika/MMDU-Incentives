import mongoose from 'mongoose';

const approvalHistorySchema = new mongoose.Schema({
  claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
  step: { type: String, required: true },
  action: { type: String, required: true },
  fromStatus: { type: String, required: true },
  toStatus: { type: String, required: true },
  actionBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionByName: { type: String, required: true },
  actionByRole: { type: String, required: true },
  remarks: { type: String, default: '' },
  date: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

approvalHistorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const ApprovalHistory = mongoose.model('ApprovalHistory', approvalHistorySchema);
export default ApprovalHistory;
