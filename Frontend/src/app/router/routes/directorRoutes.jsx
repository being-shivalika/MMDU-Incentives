import { ROUTES } from "../../../constants/routes";
import DirectorDashboard from "../../../pages/Director/Dashboard/DirectorDashboard";
import DirectorApprovals from "../../../pages/Director/Dashboard/DirectorApprovals";
import DirectorReports from "../../../pages/Director/Dashboard/DirectorReports";
import ResearchDirectory from "../../../pages/Shared/ResearchDirectory";

const directorRoutes = [
  {
    path: ROUTES.DIRECTOR_DASHBOARD,
    element: <DirectorDashboard />,
  },
  {
    path: ROUTES.DIRECTOR_APPROVALS,
    element: <DirectorApprovals />,
  },
  {
    path: ROUTES.DIRECTOR_REPORTS,
    element: <DirectorReports />,
  },
  {
    path: "/directory/research",
    element: <ResearchDirectory />,
  },
];

export default directorRoutes;
