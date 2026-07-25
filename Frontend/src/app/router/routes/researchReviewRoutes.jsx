import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import ResearchReviewDashboard from "../../../pages/ResearchReview/Dashboard/ResearchReviewDashboard";
import SubmissionReviewDetails from "../../../pages/ResearchReview/SubmissionReview/SubmissionReviewDetails";

const researchReviewRoutes = [
  {
    path: ROUTES.RESEARCH_REVIEW,
    element: <ResearchReviewDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.RD_CELL, ROLES.RPC],
  },
  {
    path: ROUTES.RESEARCH_REVIEW_QUEUE,
    element: <ResearchReviewDashboard />,
    label: "Verification Queue",
    showInSidebar: true,
    allowedRoles: [ROLES.RD_CELL, ROLES.RPC],
  },
  {
    path: ROUTES.RESEARCH_REVIEW_DETAILS,
    element: <SubmissionReviewDetails />,
    label: "Review Details",
    showInSidebar: false,
    allowedRoles: [ROLES.RD_CELL, ROLES.RPC],
  },
];

export default researchReviewRoutes;
