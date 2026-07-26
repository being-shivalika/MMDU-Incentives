import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import ApplicantsDashboard from "../../../pages/Teachers/Dashboard/ApplicantsDashboard";
import ApplicantsCreateSubmission from "../../../pages/Teachers/Submissions/ApplicantsCreateSubmissions";
import ApplicantSubmissions from "../../../pages/Teachers/Submissions/ApplicantSubmissions";
import ApplicantSubmissionDetails from "../../../pages/Teachers/Submissions/ApplicantSubmissionDetails";
import ApplicantDrafts from "../../../pages/Teachers/Submissions/ApplicantDrafts";
import ResearchDirectory from "../../../pages/Shared/ResearchDirectory";
import Policies from "../../../pages/Shared/Policies";

const applicantsRoutes = [
  {
    path: ROUTES.APPLICANT_DASHBOARD,
    element: <ApplicantsDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
  },
  {
    path: ROUTES.APPLICANT_CREATE_SUBMISSION,
    element: <ApplicantsCreateSubmission />,
    label: "Create Submission",
    showInSidebar: false,
    allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
  },
  {
    path: ROUTES.APPLICANT_SUBMISSIONS,
    element: <ApplicantSubmissions />,
    label: "My Submissions",
    showInSidebar: true,
    allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
  },
  {
    path: ROUTES.APPLICANT_SUBMISSION_DETAILS,
    element: <ApplicantSubmissionDetails />,
    label: "Submission Details",
    showInSidebar: false,
    allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
  },
  {
    path: ROUTES.APPLICANT_DRAFTS,
    element: <ApplicantDrafts />,
    label: "Drafts",
    showInSidebar: true,
    allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
  },
  {
    path: "/directory/research",
    element: <ResearchDirectory />,
    label: "Research Directory",
    showInSidebar: true,
    allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
  },
  {
    path: "/policies",
    element: <Policies />,
    label: "Policies",
    showInSidebar: true,
    allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
  },
];

export default applicantsRoutes;
