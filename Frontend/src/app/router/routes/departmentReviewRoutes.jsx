import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import DepartmentReviewDashboard from "../../../pages/DepartmentReview/Dashboard/DepartmentReviewDashboard";

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
];

export default departmentReviewRoutes;
