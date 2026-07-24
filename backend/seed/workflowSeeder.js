import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import WorkflowConfig from '../models/WorkflowConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const workflowConfig = {
  workflowKey: 'STANDARD_RESEARCH_WORKFLOW',
  name: 'Standard Academic & Research Incentive Approval Workflow',
  description: 'Standard multi-level approval workflow for research incentive claims at MMDU.',
  isActive: true,
  stages: [
    {
      order: 1,
      stageKey: 'DRAFT',
      label: 'Faculty Workspace (Draft)',
      shortLabel: 'Faculty',
      requiredRole: 'faculty',
      badgeVariant: 'secondary',
      allowedActions: [
        { type: 'SAVE_DRAFT', label: 'Save Draft', variant: 'outline', isForward: false, isTerminal: false },
        { type: 'SUBMIT_CLAIM', label: 'Submit Claim', variant: 'primary', targetStage: 'DEPARTMENT_REVIEW', isForward: true, isTerminal: false }
      ]
    },
    {
      order: 2,
      stageKey: 'DEPARTMENT_REVIEW',
      label: 'Department HOD Desk',
      shortLabel: 'HOD',
      requiredRole: 'hod',
      badgeVariant: 'warning',
      allowedActions: [
        { type: 'FORWARD_TO_PRINCIPAL', label: 'Comment & Forward to Principal', variant: 'primary', targetStage: 'PRINCIPAL_REVIEW', isForward: true, isTerminal: false },
        { type: 'RETURN_TO_FACULTY', label: 'Return to Author for Correction', variant: 'secondary', targetStage: 'RETURNED', isForward: false, isTerminal: false }
      ]
    },
    {
      order: 3,
      stageKey: 'PRINCIPAL_REVIEW',
      label: 'Office of the Principal (Executive)',
      shortLabel: 'Principal',
      requiredRole: 'principal',
      badgeVariant: 'purple',
      allowedActions: [
        { type: 'FORWARD_TO_RPC', label: 'Approve & Send to RPC', variant: 'primary', targetStage: 'RPC_VERIFICATION', isForward: true, isTerminal: false },
        { type: 'RETURN_TO_FACULTY', label: 'Return to Faculty', variant: 'secondary', targetStage: 'RETURNED', isForward: false, isTerminal: false },
        { type: 'REJECT_PERMANENTLY', label: 'Reject & Close File', variant: 'danger', targetStage: 'REJECTED', isForward: false, isTerminal: true }
      ]
    },
    {
      order: 4,
      stageKey: 'RPC_VERIFICATION',
      label: 'Research Policy Committee (RPC)',
      shortLabel: 'RPC',
      requiredRole: 'director',
      badgeVariant: 'info',
      allowedActions: [
        { type: 'APPROVE_INCENTIVE', label: 'Authorize Policy Compliance', variant: 'primary', targetStage: 'ACCOUNTS_PROCESSING', isForward: true, isTerminal: false },
        { type: 'RETURN_TO_PRINCIPAL', label: "Return to Principal's Desk", variant: 'secondary', targetStage: 'PRINCIPAL_REVIEW', isForward: false, isTerminal: false },
        { type: 'REJECT_PERMANENTLY', label: 'Reject & Close File', variant: 'danger', targetStage: 'REJECTED', isForward: false, isTerminal: true }
      ]
    },
    {
      order: 5,
      stageKey: 'ACCOUNTS_PROCESSING',
      label: 'Finance & Accounts Department',
      shortLabel: 'Accounts',
      requiredRole: 'accounts',
      badgeVariant: 'warning',
      allowedActions: [
        { type: 'RELEASE_PAYMENT', label: 'Generate Sanction & Disburse', variant: 'success', targetStage: 'COMPLETED', isForward: true, isTerminal: false },
        { type: 'RETURN', label: 'Return to RPC', variant: 'secondary', targetStage: 'RPC_VERIFICATION', isForward: false, isTerminal: false }
      ]
    }
  ],
  terminalStates: [
    { stageKey: 'COMPLETED', label: 'Completed & Disbursed', badgeVariant: 'success' },
    { stageKey: 'REJECTED', label: 'Permanently Closed / Rejected', badgeVariant: 'danger' }
  ],
  returnedState: {
    stageKey: 'RETURNED',
    label: 'Returned to Faculty',
    requiredRole: 'faculty',
    badgeVariant: 'orange',
    allowedActions: [
      { type: 'RESUBMIT_CLAIM', label: 'Resubmit to Department HOD', variant: 'primary', targetStage: 'DEPARTMENT_REVIEW', isForward: true, isTerminal: false },
      { type: 'WITHDRAW_CLAIM', label: 'Withdraw File Permanently', variant: 'danger', targetStage: 'REJECTED', isForward: false, isTerminal: true }
    ]
  }
};

const seedWorkflow = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    
    await WorkflowConfig.deleteMany({});
    console.log('Cleared existing workflow configs');
    
    const created = await WorkflowConfig.create(workflowConfig);
    console.log(`✅ Workflow configuration seeded: ${created.name}`);
    
    console.log('\nWorkflow Stages:');
    console.log('─'.repeat(60));
    created.stages.forEach(s => {
      console.log(`  ${s.order}. ${s.shortLabel.padEnd(12)} | ${s.stageKey.padEnd(22)} | Role: ${s.requiredRole}`);
      s.allowedActions.forEach(a => {
        console.log(`     → ${a.type.padEnd(25)} | Target: ${a.targetStage || 'N/A'}`);
      });
    });
    console.log('─'.repeat(60));
    console.log('Terminal States:', created.terminalStates.map(t => t.stageKey).join(', '));
    console.log('Returned State:', created.returnedState.stageKey);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Workflow seeding failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedWorkflow();
