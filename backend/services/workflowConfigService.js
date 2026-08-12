import WorkflowConfig from '../models/WorkflowConfig.js';
import logger from '../utils/logger.js';

// Cache the workflow config in memory to avoid repeated DB calls
let cachedConfig = null;

/**
 * Load the active workflow configuration from DB.
 * Caches in memory. Call invalidateCache() if admin updates config.
 * @param {string} workflowKey - default 'STANDARD_RESEARCH_WORKFLOW'
 * @returns {Object} WorkflowConfig document
 */
export const getWorkflowConfig = async (workflowKey = 'STANDARD_RESEARCH_WORKFLOW') => {
  if (cachedConfig && cachedConfig.workflowKey === workflowKey) {
    return cachedConfig;
  }
  let config = await WorkflowConfig.findOne({ workflowKey, isActive: true });
  if (!config) {
    config = await WorkflowConfig.findOne({ isActive: true });
  }

  if (!config) {
    config = await WorkflowConfig.create({
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
    });
  }
  cachedConfig = config;
  return config;
};

/**
 * Invalidate cached config (call after admin updates workflow).
 */
export const invalidateCache = () => {
  cachedConfig = null;
};

/**
 * Get a specific stage config by stageKey.
 */
export const getStageConfig = async (stageKey, workflowKey = 'STANDARD_RESEARCH_WORKFLOW') => {
  const config = await getWorkflowConfig(workflowKey);
  
  // Check regular stages
  const stage = config.stages.find(s => s.stageKey === stageKey);
  if (stage) return { ...stage.toObject(), isTerminal: false, isReturned: false };
  
  // Check terminal states
  const terminal = config.terminalStates.find(t => t.stageKey === stageKey);
  if (terminal) return { ...terminal.toObject ? terminal.toObject() : terminal, isTerminal: true, isReturned: false };
  
  // Check returned state
  if (config.returnedState && config.returnedState.stageKey === stageKey) {
    return { ...config.returnedState.toObject ? config.returnedState.toObject() : config.returnedState, isTerminal: false, isReturned: true };
  }
  
  return null;
};

/**
 * Get the next stage in order (for forward progression).
 */
export const getNextStage = async (currentStageKey, workflowKey = 'STANDARD_RESEARCH_WORKFLOW') => {
  const config = await getWorkflowConfig(workflowKey);
  const stages = config.stages.sort((a, b) => a.order - b.order);
  const currentIndex = stages.findIndex(s => s.stageKey === currentStageKey);
  if (currentIndex === -1 || currentIndex >= stages.length - 1) return null;
  return stages[currentIndex + 1];
};

/**
 * Get the previous stage in order (for backward movement).
 */
export const getPreviousStage = async (currentStageKey, workflowKey = 'STANDARD_RESEARCH_WORKFLOW') => {
  const config = await getWorkflowConfig(workflowKey);
  const stages = config.stages.sort((a, b) => a.order - b.order);
  const currentIndex = stages.findIndex(s => s.stageKey === currentStageKey);
  if (currentIndex <= 0) return null;
  return stages[currentIndex - 1];
};

/**
 * Get all stage short labels in order (for workflow progress bar).
 */
export const getOrderedStageLabels = async (workflowKey = 'STANDARD_RESEARCH_WORKFLOW') => {
  const config = await getWorkflowConfig(workflowKey);
  return config.stages
    .sort((a, b) => a.order - b.order)
    .map(s => s.shortLabel);
};

/**
 * Get all ordered stages.
 */
export const getOrderedStages = async (workflowKey = 'STANDARD_RESEARCH_WORKFLOW') => {
  const config = await getWorkflowConfig(workflowKey);
  return config.stages.sort((a, b) => a.order - b.order);
};

/**
 * Check if a stageKey is a terminal state.
 */
export const isTerminalState = async (stageKey, workflowKey = 'STANDARD_RESEARCH_WORKFLOW') => {
  const config = await getWorkflowConfig(workflowKey);
  return config.terminalStates.some(t => t.stageKey === stageKey);
};

/**
 * Find an action definition within a stage.
 */
export const findActionInStage = async (stageKey, actionType, workflowKey = 'STANDARD_RESEARCH_WORKFLOW') => {
  const stageConfig = await getStageConfig(stageKey, workflowKey);
  if (!stageConfig || !stageConfig.allowedActions) return null;
  return stageConfig.allowedActions.find(a => a.type === actionType) || null;
};
