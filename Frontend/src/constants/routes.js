export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",

  // Applicant (Student + Faculty)
  APPLICANT: "/applicant",

  APPLICANT_DASHBOARD: "/applicant",

  APPLICANT_SUBMISSIONS: "/applicant/submissions",

  APPLICANT_CREATE_SUBMISSION: "/applicant/submissions/create/:category",

  APPLICANT_SUBMISSION_DETAILS: "/applicant/submissions/:id",

  APPLICANT_EDIT_SUBMISSION: "/applicant/submissions/:id/edit",

  APPLICANT_DRAFTS: "/applicant/submissions/drafts",

  APPLICANT_PUBLICATIONS: "/applicant/publications",

  // Department Review
  DEPARTMENT_REVIEW: "/department-review",

  // Research Review
  RESEARCH_REVIEW: "/research-review",
  RESEARCH_REVIEW_QUEUE: "/research-review/queue",
  RESEARCH_REVIEW_DETAILS: "/research-review/submission/:id",

  // Accounts
  ACCOUNTS: "/accounts",

  // Administration
  ADMIN: "/admin",

  REGISTRAR: "/registrar",

  // Executive
  VC: "/vc",
};
