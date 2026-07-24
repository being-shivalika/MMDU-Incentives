import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import ResearchReviewDashboard from "../../../pages/ResearchReview/Dashboard/ResearchReviewDashboard";
import ResearchReviewDetails from "../../../pages/ResearchReview/SubmissionReview/ResearchReviewDetails";

const researchReviewRoutes = [
  {
    path: ROUTES.RESEARCH_REVIEW,
    element: <ResearchReviewDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.RD_CELL, "rpc"],
  },
  {
    path: ROUTES.RESEARCH_REVIEW_QUEUE,
    element: <ResearchReviewDashboard />,
    label: "Verification Queue",
    showInSidebar: true,
    allowedRoles: [ROLES.RD_CELL, "rpc"],
  },
  {
    path: ROUTES.RESEARCH_REVIEW_DETAILS,
    element: <ResearchReviewDetails />,
    label: "Submission Details",
    showInSidebar: false,
    allowedRoles: [ROLES.RD_CELL, "rpc"],
  },
];

export default researchReviewRoutes;
