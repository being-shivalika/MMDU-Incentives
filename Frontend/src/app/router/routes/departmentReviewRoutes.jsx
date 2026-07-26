import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import DepartmentReviewDashboard from "../../../pages/DepartmentReview/Dashboard/DepartmentReviewDashboard";
import DepartmentReviewHistory from "../../../pages/DepartmentReview/Dashboard/DepartmentReviewHistory";
import ResearchDirectory from "../../../pages/Shared/ResearchDirectory";

const departmentReviewRoutes = [
  {
    path: ROUTES.DEPARTMENT_REVIEW,
    element: <DepartmentReviewDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.HOD],
  },
  {
    path: ROUTES.DEPARTMENT_REVIEW_QUEUE,
    element: <DepartmentReviewDashboard />,
    label: "Department Queue",
    showInSidebar: true,
    allowedRoles: [ROLES.HOD],
  },
  {
    path: ROUTES.DEPARTMENT_REVIEW_HISTORY,
    element: <DepartmentReviewHistory />,
    label: "Review History",
    showInSidebar: true,
    allowedRoles: [ROLES.HOD],
  },
  {
    path: "/directory/research",
    element: <ResearchDirectory />,
    label: "Research Directory",
    showInSidebar: true,
    allowedRoles: [ROLES.HOD],
  },
];

export default departmentReviewRoutes;
