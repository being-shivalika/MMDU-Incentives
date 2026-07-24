import mongoose from 'mongoose';

const allowedActionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  label: { type: String, required: true },
  variant: { type: String, default: 'primary' },
  targetStage: { type: String },
  isForward: { type: Boolean, default: true },
  isTerminal: { type: Boolean, default: false }
}, { _id: false });

const stageSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  stageKey: { type: String, required: true },
  label: { type: String, required: true },
  shortLabel: { type: String, required: true },
  requiredRole: { type: String, required: true },
  badgeVariant: { type: String, default: 'secondary' },
  allowedActions: [allowedActionSchema]
}, { _id: false });

const terminalStateSchema = new mongoose.Schema({
  stageKey: { type: String },
  label: { type: String },
  badgeVariant: { type: String }
}, { _id: false });

const returnedStateSchema = new mongoose.Schema({
  stageKey: { type: String, default: 'RETURNED' },
  label: { type: String, default: 'Returned to Faculty' },
  requiredRole: { type: String, default: 'faculty' },
  badgeVariant: { type: String, default: 'orange' },
  allowedActions: [allowedActionSchema]
}, { _id: false });

const workflowConfigSchema = new mongoose.Schema({
  workflowKey: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  stages: [stageSchema],
  terminalStates: [terminalStateSchema],
  returnedState: { type: returnedStateSchema, default: () => ({}) }
}, { timestamps: true });

workflowConfigSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const WorkflowConfig = mongoose.model('WorkflowConfig', workflowConfigSchema);
export default WorkflowConfig;
