import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import AdminDashboard from "../../../pages/Admin/Dashboard/AdminDashboard";
import AllSubmissions from "../../../pages/Admin/Dashboard/AllSubmissions";
import UserManagement from "../../../pages/Admin/Dashboard/UserManagement";
import Circulars from "../../../pages/Admin/Dashboard/Circulars";
import AuditLogs from "../../../pages/Admin/Dashboard/AuditLogs";
import PortalSettings from "../../../pages/Admin/Dashboard/PortalSettings";

const adminRoutes = [
  {
    path: ROUTES.ADMIN,
    element: <AdminDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: ROUTES.ADMIN_SUBMISSIONS,
    element: <AllSubmissions />,
    label: "Submissions",
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: ROUTES.ADMIN_USERS,
    element: <UserManagement />,
    label: "User Management",
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: ROUTES.ADMIN_CIRCULARS,
    element: <Circulars />,
    label: "Circulars",
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: ROUTES.ADMIN_AUDIT,
    element: <AuditLogs />,
    label: "Audit Logs",
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    path: ROUTES.ADMIN_SETTINGS,
    element: <PortalSettings />,
    label: "Settings",
    showInSidebar: true,
    allowedRoles: [ROLES.ADMIN],
  },
];

export default adminRoutes;
