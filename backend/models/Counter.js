import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prefix: { type: String, required: true },
  year: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

counterSchema.index({ name: 1, year: 1 }, { unique: true });

counterSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Counter = mongoose.model('Counter', counterSchema);
export default Counter;
