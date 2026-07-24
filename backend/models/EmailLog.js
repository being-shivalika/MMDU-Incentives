import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' },
  type: { type: String },
  status: { type: String, enum: ['sent', 'failed', 'pending'], default: 'pending' },
  error: { type: String },
  sentAt: { type: Date }
}, { timestamps: true });

emailLogSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);
export default EmailLog;
