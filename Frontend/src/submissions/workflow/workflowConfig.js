// Master enterprise workflow state machine configuration.
// Approval authority:
// HOD -> Department validation
// RD Cell -> Final research/incentive approval
// Others -> View only

export const WORKFLOW_STATES = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  DEPARTMENT_REVIEW: "DEPARTMENT_REVIEW",
  RPC_REVIEW: "RPC_REVIEW",
  COMPLETED: "COMPLETED",
  RETURNED: "RETURNED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
  CANCELLED: "CANCELLED",
};

export const WORKFLOW_DEFINITIONS = {
  STANDARD_RESEARCH_WORKFLOW: {
    id: "STANDARD_RESEARCH_WORKFLOW",
    name: "Academic Research Approval Workflow",

    initialState: WORKFLOW_STATES.DRAFT,

    states: {
      DRAFT: {
        label: "Draft",
        badgeVariant: "secondary",
        requiredRole: "faculty",

        allowedActions: [
          {
            type: "SAVE_DRAFT",
            label: "Save Draft",
            variant: "outline",
          },
          {
            type: "SUBMIT_CLAIM",
            label: "Submit Claim",
            variant: "primary",
          },
          {
            type: "CANCEL",
            label: "Cancel Draft",
            variant: "ghost",
          },
        ],

        transitions: {
          SUBMIT_CLAIM: {
            target: WORKFLOW_STATES.DEPARTMENT_REVIEW,
            notifyRoles: ["hod"],
          },

          CANCEL: {
            target: WORKFLOW_STATES.CANCELLED,
          },
        },
      },

      DEPARTMENT_REVIEW: {
        label: "Department Review (HOD)",
        badgeVariant: "warning",

        requiredRole: "hod",

        allowedActions: [
          {
            type: "APPROVE",
            label: "Approve & Send to RD Cell",
            variant: "primary",
          },

          {
            type: "RETURN",
            label: "Request Correction",
            variant: "secondary",
          },

          {
            type: "REJECT",
            label: "Reject Claim",
            variant: "danger",
          },
        ],

        transitions: {
          APPROVE: {
            target: WORKFLOW_STATES.RPC_REVIEW,
            notifyRoles: ["rd_cell"],
          },

          RETURN: {
            target: WORKFLOW_STATES.RETURNED,
            notifyRoles: ["faculty"],
          },

          REJECT: {
            target: WORKFLOW_STATES.REJECTED,
            notifyRoles: ["faculty"],
          },
        },
      },

      RPC_REVIEW: {
        label: "RD Cell Final Verification",

        badgeVariant: "info",

        requiredRole: "rd_cell",

        allowedActions: [
          {
            type: "APPROVE_INCENTIVE",
            label: "Final Approve",
            variant: "primary",
          },

          {
            type: "RETURN",
            label: "Request Correction",
            variant: "secondary",
          },

          {
            type: "REJECT",
            label: "Reject Claim",
            variant: "danger",
          },
        ],

        transitions: {
          APPROVE_INCENTIVE: {
            target: WORKFLOW_STATES.COMPLETED,
            notifyRoles: ["faculty", "hod"],
          },

          RETURN: {
            target: WORKFLOW_STATES.RETURNED,
            notifyRoles: ["faculty"],
          },

          REJECT: {
            target: WORKFLOW_STATES.REJECTED,
            notifyRoles: ["faculty"],
          },
        },
      },

      RETURNED: {
        label: "Correction Required",

        badgeVariant: "orange",

        requiredRole: "faculty",

        allowedActions: [
          {
            type: "RESUBMIT",
            label: "Resubmit Updated Claim",
            variant: "primary",
          },

          {
            type: "WITHDRAW",
            label: "Withdraw Claim",
            variant: "danger",
          },
        ],

        transitions: {
          RESUBMIT: {
            target: WORKFLOW_STATES.DEPARTMENT_REVIEW,
            notifyRoles: ["hod"],
          },

          WITHDRAW: {
            target: WORKFLOW_STATES.WITHDRAWN,
          },
        },
      },

      COMPLETED: {
        label: "Approved & Completed",
        badgeVariant: "success",
        terminal: true,
      },

      REJECTED: {
        label: "Rejected",
        badgeVariant: "danger",
        terminal: true,
      },

      WITHDRAWN: {
        label: "Withdrawn",
        badgeVariant: "secondary",
        terminal: true,
      },

      CANCELLED: {
        label: "Cancelled",
        badgeVariant: "secondary",
        terminal: true,
      },
    },
  },
};

// Role based visibility
// Approval authority exists ONLY here.

export const WORKFLOW_PERMISSIONS = {
  faculty: {
    canCreate: true,
    canEdit: true,
    canApprove: false,
    canReject: false,
    canRequestCorrection: false,
  },

  hod: {
    canCreate: false,
    canApprove: true,
    canReject: true,
    canRequestCorrection: true,
  },

  rd_cell: {
    canCreate: false,
    canApprove: true,
    canReject: true,
    canRequestCorrection: true,
    isFinalAuthority: true,
  },

  principal: {
    viewOnly: true,
  },

  director: {
    viewOnly: true,
  },

  accounts: {
    viewOnly: true,
  },

  admin: {
    viewOnly: true,
  },
};
