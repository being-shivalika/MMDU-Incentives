import { ROUTES } from "../../../constants/routes";
import VCDashboard from "../../../pages/VC/Dashboard/VCDashboard";
import VCApprovals from "../../../pages/VC/Dashboard/VCApprovals";
import VCReports from "../../../pages/VC/Dashboard/VCReports";

const vcRoutes = [
  {
    path: ROUTES.VC,
    element: <VCDashboard />,
  },
  {
    path: ROUTES.VC_APPROVALS,
    element: <VCApprovals />,
  },
  {
    path: ROUTES.VC_REPORTS,
    element: <VCReports />,
  },
];

export default vcRoutes;
