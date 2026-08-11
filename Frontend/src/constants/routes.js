export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",

  // Applicant (Student + Faculty)
  APPLICANT: "/applicant",
  APPLICANT_DASHBOARD: "/applicant",
  APPLICANT_SUBMISSIONS: "/applicant/submissions",
  APPLICANT_CREATE_SUBMISSION: "/applicant/submissions/create/:category",
  APPLICANT_SUBMISSION_DETAILS: "/applicant/submissions/:id",
  APPLICANT_EDIT_SUBMISSION: "/applicant/submissions/:id/edit",
  APPLICANT_DRAFTS: "/applicant/drafts",
  APPLICANT_PUBLICATIONS: "/applicant/publications",

  // Department Review (HOD)
  DEPARTMENT_REVIEW: "/hod",
  DEPARTMENT_REVIEW_QUEUE: "/hod/reviews",
  DEPARTMENT_REVIEW_HISTORY: "/hod/history",

  // Principal
  PRINCIPAL_DASHBOARD: "/principal",
  PRINCIPAL_APPROVALS: "/principal/approvals",
  PRINCIPAL_HISTORY: "/principal/history",

  // Director
  DIRECTOR_DASHBOARD: "/director",
  DIRECTOR_APPROVALS: "/director/approvals",
  DIRECTOR_REPORTS: "/director/reports",

  // Research Review (RPC / RD Cell)
  RESEARCH_REVIEW: "/research-review",
  RESEARCH_REVIEW_QUEUE: "/research-review/queue",
  RESEARCH_REVIEW_HISTORY: "/research-review/history",
  RESEARCH_REVIEW_DETAILS: "/research-review/submission/:id",
  RPC_ANALYTICS: "/rpc/analytics",
  RPC_REPORTS: "/rpc/reports",

  // Accounts
  ACCOUNTS: "/accounts",
  ACCOUNTS_PAYMENTS: "/accounts/payments",
  ACCOUNTS_HISTORY: "/accounts/history",

  // Administration
  ADMIN: "/admin",
  ADMIN_SUBMISSIONS: "/admin/submissions",
  ADMIN_USERS: "/admin/users",
  ADMIN_CIRCULARS: "/admin/circulars",
  ADMIN_AUDIT: "/admin/audit",
  ADMIN_SETTINGS: "/admin/settings",

  // Registrar
  REGISTRAR: "/registrar",
  REGISTRAR_RECORDS: "/registrar/records",
  REGISTRAR_VERIFICATIONS: "/registrar/verifications",

  // Executive (VC)
  VC: "/vc",
  VC_APPROVALS: "/vc/approvals",
  VC_REPORTS: "/vc/reports",
};
