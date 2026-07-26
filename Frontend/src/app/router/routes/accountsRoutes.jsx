import { ROLES } from "../../../constants/roles";
import { ROUTES } from "../../../constants/routes";

import AccountsDashboard from "../../../pages/Accounts/Dashboard/AccountsDashboard";
import PaymentQueue from "../../../pages/Accounts/Dashboard/PaymentQueue";
import PaymentHistory from "../../../pages/Accounts/Dashboard/PaymentHistory";

const accountsRoutes = [
  {
    path: ROUTES.ACCOUNTS,
    element: <AccountsDashboard />,
    label: "Dashboard",
    showInSidebar: true,
    allowedRoles: [ROLES.ACCOUNTS],
  },
  {
    path: ROUTES.ACCOUNTS_PAYMENTS,
    element: <PaymentQueue />,
    label: "Payment Queue",
    showInSidebar: true,
    allowedRoles: [ROLES.ACCOUNTS],
  },
  {
    path: ROUTES.ACCOUNTS_HISTORY,
    element: <PaymentHistory />,
    label: "Payment History",
    showInSidebar: true,
    allowedRoles: [ROLES.ACCOUNTS],
  },
];

export default accountsRoutes;
