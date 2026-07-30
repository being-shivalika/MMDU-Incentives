import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import ResearchReviewDashboard from "../../../pages/ResearchReview/Dashboard/ResearchReviewDashboard";
import SubmissionReviewDetails from "../../../pages/ResearchReview/SubmissionReview/SubmissionReviewDetails";
import ResearchReviewHistory from "../../../pages/ResearchReview/Dashboard/ResearchReviewHistory";
import ResearchAnalytics from "../../../pages/ResearchReview/Dashboard/ResearchAnalytics";
import ResearchReports from "../../../pages/ResearchReview/Dashboard/ResearchReports";
import ResearchDirectory from "../../../pages/Shared/ResearchDirectory";

const researchReviewRoutes = [
  {
    path: ROUTES.RESEARCH_REVIEW,
    element: <ResearchReviewDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.RD_CELL, ROLES.RPC_CELL],
  },
  {
    path: ROUTES.RESEARCH_REVIEW_QUEUE,
    element: <ResearchReviewDashboard />,
    label: "Verification Queue",
    showInSidebar: true,
    allowedRoles: [ROLES.RD_CELL, ROLES.RPC_CELL],
  },

  {
    path: ROUTES.RESEARCH_REVIEW_HISTORY,
    element: <ResearchReviewHistory />,
    label: "Review History",
    showInSidebar: true,
    allowedRoles: [ROLES.RD_CELL, ROLES.RPC_CELL],
  },
  {
    path: ROUTES.RESEARCH_REVIEW_DETAILS,
    element: <SubmissionReviewDetails />,
    label: "Review Submission Details",
    showInSidebar: false,
    allowedRoles: [ROLES.RD_CELL, ROLES.RPC_CELL],
  },
];

export default researchReviewRoutes;
