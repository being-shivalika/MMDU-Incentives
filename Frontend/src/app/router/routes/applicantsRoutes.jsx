import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import ApplicantsDashboard from "../../../pages/Teachers/Dashboard/ApplicantsDashboard";
import ApplicantsCreateSubmission from "../../../pages/Teachers/Submissions/ApplicantsCreateSubmissions";
import { MySubmissions } from "../../../submissions/MySubmissions";

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
    path: ROUTES.APPLICANT_MY_SUBMISSIONS,
    element: <MySubmissions />,
    label: "My Submissions",
    showInSidebar: true,
    allowedRoles: [ROLES.STUDENT, ROLES.FACULTY],
  },
];

export default applicantsRoutes;
