import { useMemo } from "react";
import { evaluateWorkflowState } from "../workflow/workflowEngine";

export const useWorkflowActions = (submission, user) => {
  return useMemo(() => {
    if (!submission || !user) {
      return { allowedActions: [], terminal: false, stateLabel: "Unknown", badgeVariant: "secondary" };
    }
    const stateEvaluation = evaluateWorkflowState(submission, user);
    return {
      allowedActions: stateEvaluation.allowedActions,
      terminal: stateEvaluation.terminal,
      stateLabel: stateEvaluation.label,
      badgeVariant: stateEvaluation.badgeVariant,
      requiredRole: stateEvaluation.requiredRole
    };
  }, [submission, user]);
};
