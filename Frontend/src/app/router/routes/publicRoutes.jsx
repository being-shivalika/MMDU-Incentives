import { ROUTES } from "../../../constants/routes";
import LoginPage from "../../../pages/Auth/LoginPage";
import LandingPage from "../../../pages/Hero/LandingPage";
import ForgotPassword from "../../../pages/Auth/ForgotPassword";

const publicRoutes = [
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
];

export default publicRoutes;
