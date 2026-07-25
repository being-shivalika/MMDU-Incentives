import mongoose from 'mongoose';

const financialYearSchema = new mongoose.Schema({
  label: { type: String, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isCurrent: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

financialYearSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const FinancialYear = mongoose.model('FinancialYear', financialYearSchema);
export default FinancialYear;
