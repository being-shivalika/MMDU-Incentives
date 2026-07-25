import { ROUTES } from "../../../constants/routes";
import PrincipalDashboard from "../../../pages/Principal/Dashboard/PrincipalDashboard";

const principalRoutes = [
  {
    path: ROUTES.PRINCIPAL_DASHBOARD,
    element: <PrincipalDashboard />,
  },
];

export default principalRoutes;
