import { ROUTES } from "../../../constants/routes";
import PrincipalDashboard from "../../../pages/Principal/Dashboard/PrincipalDashboard";
import PrincipalApprovals from "../../../pages/Principal/Dashboard/PrincipalApprovals";
import PrincipalHistory from "../../../pages/Principal/Dashboard/PrincipalHistory";
import ResearchDirectory from "../../../pages/Shared/ResearchDirectory";

const principalRoutes = [
  {
    path: ROUTES.PRINCIPAL_DASHBOARD,
    element: <PrincipalDashboard />,
  },
  {
    path: ROUTES.PRINCIPAL_APPROVALS,
    element: <PrincipalApprovals />,
  },
  {
    path: ROUTES.PRINCIPAL_HISTORY,
    element: <PrincipalHistory />,
  },
  {
    path: "/directory/research",
    element: <ResearchDirectory />,
  },
];

export default principalRoutes;
