import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import AccountsDashboard from "../../../pages/Accounts/Dashboard/AccountsDashboard";

const accountsRoutes = [
  {
    path: ROUTES.ACCOUNTS,
    element: <AccountsDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.ACCOUNTS],
  },
];

export default accountsRoutes;
