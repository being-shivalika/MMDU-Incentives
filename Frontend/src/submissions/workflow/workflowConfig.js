// Master enterprise workflow state machine configuration.
// Definitively decouples approval logic and routing from React page components.

export const WORKFLOW_STATES = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  DEPARTMENT_REVIEW: "DEPARTMENT_REVIEW",
  FACULTY_VERIFICATION: "FACULTY_VERIFICATION",
  PRINCIPAL_REVIEW: "PRINCIPAL_REVIEW",
  RPC_REVIEW: "RPC_REVIEW",
  FINANCE: "FINANCE",
  COMPLETED: "COMPLETED",
  RETURNED: "RETURNED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
  CANCELLED: "CANCELLED"
};

export const WORKFLOW_DEFINITIONS = {
  STANDARD_RESEARCH_WORKFLOW: {
    id: "STANDARD_RESEARCH_WORKFLOW",
    name: "Standard Academic & Research Approval Workflow",
    initialState: WORKFLOW_STATES.DRAFT,
    states: {
      DRAFT: {
        label: "Draft",
        badgeVariant: "secondary",
        requiredRole: "faculty",
        allowedActions: [
          { type: "SAVE_DRAFT", label: "Save Draft", variant: "outline" },
          { type: "SUBMIT_CLAIM", label: "Submit Claim", variant: "primary" },
          { type: "CANCEL", label: "Cancel Draft", variant: "ghost" }
        ],
        transitions: {
          SUBMIT_CLAIM: { target: WORKFLOW_STATES.DEPARTMENT_REVIEW, notifyRoles: ["hod"] },
          CANCEL: { target: WORKFLOW_STATES.CANCELLED }
        }
      },
      DEPARTMENT_REVIEW: {
        label: "Department Review (HOD)",
        badgeVariant: "warning",
        requiredRole: "hod",
        allowedActions: [
          { type: "APPROVE", label: "Approve & Forward", variant: "primary" },
          { type: "RETURN", label: "Return for Clarification", variant: "secondary" },
          { type: "REJECT", label: "Reject Claim", variant: "danger" }
        ],
        transitions: {
          APPROVE: { target: WORKFLOW_STATES.FACULTY_VERIFICATION, notifyRoles: ["director"] },
          RETURN: { target: WORKFLOW_STATES.RETURNED, notifyRoles: ["faculty"] },
          REJECT: { target: WORKFLOW_STATES.REJECTED, notifyRoles: ["faculty"] }
        }
      },
      FACULTY_VERIFICATION: {
        label: "Verification & Indexing Check",
        badgeVariant: "info",
        requiredRole: "director",
        allowedActions: [
          { type: "VERIFY_DATA", label: "Verify DOI & Metrics", variant: "primary" },
          { type: "RETURN", label: "Return to Author", variant: "secondary" }
        ],
        transitions: {
          VERIFY_DATA: { target: WORKFLOW_STATES.PRINCIPAL_REVIEW, notifyRoles: ["principal"] },
          RETURN: { target: WORKFLOW_STATES.RETURNED, notifyRoles: ["faculty"] }
        }
      },
      PRINCIPAL_REVIEW: {
        label: "Executive Review (Principal)",
        badgeVariant: "purple",
        requiredRole: "principal",
        allowedActions: [
          { type: "APPROVE", label: "Grant Executive Approval", variant: "primary" },
          { type: "RETURN", label: "Return Claim", variant: "secondary" },
          { type: "REJECT", label: "Reject Claim", variant: "danger" }
        ],
        transitions: {
          APPROVE: { target: WORKFLOW_STATES.RPC_REVIEW, notifyRoles: ["director"] },
          RETURN: { target: WORKFLOW_STATES.RETURNED, notifyRoles: ["faculty"] },
          REJECT: { target: WORKFLOW_STATES.REJECTED, notifyRoles: ["faculty"] }
        }
      },
      RPC_REVIEW: {
        label: "RPC Incentive Authorization",
        badgeVariant: "info",
        requiredRole: "director",
        allowedActions: [
          { type: "APPROVE_INCENTIVE", label: "Authorize Incentive Credit", variant: "primary" },
          { type: "RETURN", label: "Return Claim", variant: "secondary" },
          { type: "REJECT", label: "Reject Claim", variant: "danger" }
        ],
        transitions: {
          APPROVE_INCENTIVE: { target: WORKFLOW_STATES.FINANCE, notifyRoles: ["accounts", "faculty"] },
          RETURN: { target: WORKFLOW_STATES.RETURNED, notifyRoles: ["faculty"] },
          REJECT: { target: WORKFLOW_STATES.REJECTED, notifyRoles: ["faculty"] }
        }
      },
      FINANCE: {
        label: "Accounts & Disbursement",
        badgeVariant: "warning",
        requiredRole: "accounts",
        allowedActions: [
          { type: "RELEASE_PAYMENT", label: "Disburse Incentive Funds", variant: "success" },
          { type: "RETURN", label: "Return to RPC", variant: "secondary" }
        ],
        transitions: {
          RELEASE_PAYMENT: { target: WORKFLOW_STATES.COMPLETED, notifyRoles: ["faculty", "hod", "principal"] },
          RETURN: { target: WORKFLOW_STATES.RPC_REVIEW, notifyRoles: ["director"] }
        }
      },
      RETURNED: {
        label: "Returned to Faculty",
        badgeVariant: "orange",
        requiredRole: "faculty",
        allowedActions: [
          { type: "RESUBMIT", label: "Resubmit Updated Claim", variant: "primary" },
          { type: "WITHDRAW", label: "Withdraw Claim", variant: "danger" }
        ],
        transitions: {
          RESUBMIT: { target: WORKFLOW_STATES.DEPARTMENT_REVIEW, notifyRoles: ["hod"] },
          WITHDRAW: { target: WORKFLOW_STATES.WITHDRAWN }
        }
      },
      COMPLETED: { label: "Completed & Disbursed", badgeVariant: "success", terminal: true },
      REJECTED: { label: "Rejected", badgeVariant: "danger", terminal: true },
      WITHDRAWN: { label: "Withdrawn", badgeVariant: "secondary", terminal: true },
      CANCELLED: { label: "Cancelled", badgeVariant: "secondary", terminal: true }
    }
  },

  FAST_TRACK_WORKFLOW: {
    id: "FAST_TRACK_WORKFLOW",
    name: "Fast-Track Approval Workflow",
    initialState: WORKFLOW_STATES.DRAFT,
    states: {
      DRAFT: {
        label: "Draft",
        badgeVariant: "secondary",
        requiredRole: "faculty",
        allowedActions: [{ type: "SUBMIT_CLAIM", label: "Submit Claim", variant: "primary" }],
        transitions: { SUBMIT_CLAIM: { target: WORKFLOW_STATES.DEPARTMENT_REVIEW, notifyRoles: ["hod"] } }
      },
      DEPARTMENT_REVIEW: {
        label: "Department Review (HOD)",
        badgeVariant: "warning",
        requiredRole: "hod",
        allowedActions: [{ type: "APPROVE", label: "Approve", variant: "primary" }],
        transitions: { APPROVE: { target: WORKFLOW_STATES.RPC_REVIEW, notifyRoles: ["director"] } }
      },
      RPC_REVIEW: {
        label: "RPC Verification",
        badgeVariant: "info",
        requiredRole: "director",
        allowedActions: [{ type: "APPROVE_INCENTIVE", label: "Verify & Approve", variant: "primary" }],
        transitions: { APPROVE_INCENTIVE: { target: WORKFLOW_STATES.COMPLETED, notifyRoles: ["faculty"] } }
      },
      COMPLETED: { label: "Completed", badgeVariant: "success", terminal: true }
    }
  }
};
