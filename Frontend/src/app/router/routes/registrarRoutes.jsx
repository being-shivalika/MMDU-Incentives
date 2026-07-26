import { ROUTES } from "../../../constants/routes";
import RegistrarDashboard from "../../../pages/Registrar/Dashboard/RegistrarDashboard";
import RegistrarRecords from "../../../pages/Registrar/Dashboard/RegistrarRecords";
import RegistrarVerifications from "../../../pages/Registrar/Dashboard/RegistrarVerifications";

const registrarRoutes = [
  {
    path: ROUTES.REGISTRAR,
    element: <RegistrarDashboard />,
  },
  {
    path: ROUTES.REGISTRAR_RECORDS,
    element: <RegistrarRecords />,
  },
  {
    path: ROUTES.REGISTRAR_VERIFICATIONS,
    element: <RegistrarVerifications />,
  },
];

export default registrarRoutes;
