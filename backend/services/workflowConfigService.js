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
  const config = await WorkflowConfig.findOne({ workflowKey, isActive: true });
  if (!config) {
    throw new Error(`Workflow configuration '${workflowKey}' not found or inactive`);
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
