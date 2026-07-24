// Standard state machine configuration for the Research Incentive Claim Management System (RICMS)
// Models files moving physically across departmental desks.

export const DESK_STATES = {
  DRAFT: "DRAFT",
  DEPARTMENT_REVIEW: "DEPARTMENT_REVIEW", // HOD Desk
  PRINCIPAL_REVIEW: "PRINCIPAL_REVIEW",   // Principal Desk
  RPC_VERIFICATION: "RPC_VERIFICATION",   // RPC Desk
  ACCOUNTS_PROCESSING: "ACCOUNTS_PROCESSING", // Accounts Desk
  COMPLETED: "COMPLETED",                 // Disbursed (Terminal)
  RETURNED: "RETURNED",                   // Faculty Desk for Correction
  REJECTED: "REJECTED"                    // Closed (Terminal)
};

export const DESK_CONFIGS = {
  [DESK_STATES.DRAFT]: {
    label: "Faculty Workspace (Draft)",
    requiredRole: "faculty",
    badgeVariant: "secondary",
    allowedActions: [
      { type: "SAVE_DRAFT", label: "Save Draft", variant: "outline" },
      { type: "SUBMIT_CLAIM", label: "Submit Claim File", variant: "primary" }
    ],
    transitions: {
      SUBMIT_CLAIM: { target: DESK_STATES.DEPARTMENT_REVIEW, notifyRole: "hod" }
    }
  },
  [DESK_STATES.DEPARTMENT_REVIEW]: {
    label: "Department HOD Desk",
    requiredRole: "hod",
    badgeVariant: "warning",
    allowedActions: [
      { type: "FORWARD_TO_PRINCIPAL", label: "Comment & Forward to Principal", variant: "primary" },
      { type: "RETURN_TO_FACULTY", label: "Return to Author for Correction", variant: "secondary" }
    ],
    transitions: {
      FORWARD_TO_PRINCIPAL: { target: DESK_STATES.PRINCIPAL_REVIEW, notifyRole: "principal" },
      RETURN_TO_FACULTY: { target: DESK_STATES.RETURNED, notifyRole: "faculty" }
    }
  },
  [DESK_STATES.PRINCIPAL_REVIEW]: {
    label: "Office of the Principal (Executive)",
    requiredRole: "principal",
    badgeVariant: "purple",
    allowedActions: [
      { type: "FORWARD_TO_RPC", label: "Approve & Send to RPC", variant: "primary" },
      { type: "RETURN_TO_FACULTY", label: "Return to Faculty", variant: "secondary" },
      { type: "REJECT_PERMANENTLY", label: "Reject & Close File", variant: "danger" }
    ],
    transitions: {
      FORWARD_TO_RPC: { target: DESK_STATES.RPC_VERIFICATION, notifyRole: "director" },
      RETURN_TO_FACULTY: { target: DESK_STATES.RETURNED, notifyRole: "faculty" },
      REJECT_PERMANENTLY: { target: DESK_STATES.REJECTED, notifyRole: "faculty" }
    }
  },
  [DESK_STATES.RPC_VERIFICATION]: {
    label: "Research Policy Committee (RPC)",
    requiredRole: "director",
    badgeVariant: "info",
    allowedActions: [
      { type: "APPROVE_INCENTIVE", label: "Authorize Policy Compliance", variant: "primary" },
      { type: "RETURN_TO_PRINCIPAL", label: "Return to Principal's Desk", variant: "secondary" },
      { type: "REJECT_TO_PRINCIPAL", label: "Reject (Send back to Principal)", variant: "danger" }
    ],
    transitions: {
      APPROVE_INCENTIVE: { target: DESK_STATES.ACCOUNTS_PROCESSING, notifyRole: "accounts" },
      RETURN_TO_PRINCIPAL: { target: DESK_STATES.PRINCIPAL_REVIEW, notifyRole: "principal" },
      REJECT_TO_PRINCIPAL: { target: DESK_STATES.PRINCIPAL_REVIEW, notifyRole: "principal" }
    }
  },
  [DESK_STATES.ACCOUNTS_PROCESSING]: {
    label: "Finance & Accounts Department",
    requiredRole: "accounts",
    badgeVariant: "warning",
    allowedActions: [
      { type: "RELEASE_PAYMENT", label: "Generate Sanction & Disburse", variant: "success" }
    ],
    transitions: {
      RELEASE_PAYMENT: { target: DESK_STATES.COMPLETED, notifyRole: "faculty" }
    }
  },
  [DESK_STATES.RETURNED]: {
    label: "Returned Claims",
    requiredRole: "faculty",
    badgeVariant: "orange",
    allowedActions: [
      { type: "RESUBMIT_CLAIM", label: "Resubmit to Department HOD", variant: "primary" },
      { type: "WITHDRAW_CLAIM", label: "Withdraw File permanently", variant: "danger" }
    ],
    transitions: {
      RESUBMIT_CLAIM: { target: DESK_STATES.DEPARTMENT_REVIEW, notifyRole: "hod" },
      WITHDRAW_CLAIM: { target: DESK_STATES.REJECTED }
    }
  },
  [DESK_STATES.COMPLETED]: {
    label: "Completed & Disbursed",
    badgeVariant: "success",
    terminal: true
  },
  [DESK_STATES.REJECTED]: {
    label: "Permanently Closed / Rejected",
    badgeVariant: "danger",
    terminal: true
  }
};

export const getDeskStateConfig = (stateKey) => {
  return DESK_CONFIGS[stateKey] || { label: stateKey, badgeVariant: "secondary", allowedActions: [], terminal: true };
};
