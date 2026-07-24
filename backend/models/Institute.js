import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const Institute = mongoose.model('Institute', instituteSchema);

export default Institute;
