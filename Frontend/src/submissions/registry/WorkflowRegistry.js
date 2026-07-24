import { WORKFLOW_DEFINITIONS } from "../workflow/workflowConfig";

class WorkflowRegistryStore {
  constructor() {
    this.workflows = new Map();
    Object.entries(WORKFLOW_DEFINITIONS).forEach(([key, wf]) => {
      this.workflows.set(key, wf);
    });
  }

  register(key, workflowDef) {
    this.workflows.set(key, workflowDef);
  }

  get(key) {
    return this.workflows.get(key) || this.workflows.get("STANDARD_RESEARCH_WORKFLOW");
  }
}

export const WorkflowRegistry = new WorkflowRegistryStore();
