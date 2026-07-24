import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import AdminDashboard from "../../../pages/Admin/Dashboard/AdminDashboard";

const adminRoutes = [
  {
    path: ROUTES.ADMIN,
    element: <AdminDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN],
  },
];

export default adminRoutes;
