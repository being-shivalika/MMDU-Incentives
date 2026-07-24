import { getDeskStateConfig } from "../config/workflowDesks";

export const evaluateWorkflowState = (submission, user) => {
  if (!submission) return { allowedActions: [], terminal: false };

  const currentStateKey = submission.status || "DRAFT";
  const deskConfig = getDeskStateConfig(currentStateKey);

  if (!deskConfig) {
    return {
      allowedActions: [],
      terminal: true,
      label: currentStateKey,
      badgeVariant: "secondary"
    };
  }

  if (deskConfig.terminal) {
    return {
      allowedActions: [],
      terminal: true,
      label: deskConfig.label,
      badgeVariant: deskConfig.badgeVariant
    };
  }

  const roleMatches = deskConfig.requiredRole === user.role;
  const allowedActions = roleMatches ? (deskConfig.allowedActions || []) : [];

  return {
    allowedActions,
    terminal: false,
    label: deskConfig.label,
    badgeVariant: deskConfig.badgeVariant,
    requiredRole: deskConfig.requiredRole,
    transitions: deskConfig.transitions
  };
};

export const getNextState = (submission, actionType) => {
  const currentStateKey = submission.status || "DRAFT";
  const deskConfig = getDeskStateConfig(currentStateKey);

  if (!deskConfig || !deskConfig.transitions) return null;

  const transition = deskConfig.transitions[actionType];
  return transition ? transition.target : null;
};
