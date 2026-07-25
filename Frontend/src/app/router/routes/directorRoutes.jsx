import { ROUTES } from "../../../constants/routes";
import DirectorDashboard from "../../../pages/Director/Dashboard/DirectorDashboard";

const directorRoutes = [
  {
    path: ROUTES.DIRECTOR_DASHBOARD,
    element: <DirectorDashboard />,
  },
];

export default directorRoutes;
