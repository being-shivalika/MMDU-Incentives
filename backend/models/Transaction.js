import mongoose from 'mongoose';

const transactionHistorySchema = new mongoose.Schema({
  status: { type: String },
  amount: { type: Number },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String },
  date: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true, unique: true, index: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  financialYear: { type: String, required: true, index: true },
  currency: { type: String, default: 'INR' },
  calculatedAmount: { type: Number, required: true },
  approvedAmount: { type: Number, default: 0 },
  releasedAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  voucherNumber: { type: String, index: true },
  billNumber: { type: String },
  sanctionNumber: { type: String },
  utrNumber: { type: String },
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'processing', 'completed', 'failed'], index: true },
  paymentDate: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String },
  transactionHistory: [transactionHistorySchema]
}, { timestamps: true });

transactionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
