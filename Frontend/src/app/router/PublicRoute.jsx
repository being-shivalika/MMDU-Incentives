import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { ROLES } from "../../constants/roles";

const ROLE_REDIRECT = {
  [ROLES.STUDENT]: ROUTES.APPLICANT_DASHBOARD,
  [ROLES.FACULTY]: ROUTES.APPLICANT_DASHBOARD,

  [ROLES.HOD]: ROUTES.DEPARTMENT_REVIEW,
  [ROLES.PRINCIPAL]: ROUTES.PRINCIPAL_DASHBOARD,
  [ROLES.DIRECTOR]: ROUTES.DIRECTOR_DASHBOARD,

  [ROLES.RD_CELL]: ROUTES.RESEARCH_REVIEW,
  [ROLES.RPC]: ROUTES.RESEARCH_REVIEW,

  [ROLES.ACCOUNTS]: ROUTES.ACCOUNTS,

  [ROLES.ADMIN]: ROUTES.ADMIN,
  [ROLES.REGISTRAR]: ROUTES.REGISTRAR,

  [ROLES.VC]: ROUTES.VC,
};

const PublicRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Outlet />;
  }

  const role = user.role?.toLowerCase();

  return <Navigate to={ROLE_REDIRECT[role] || ROUTES.LOGIN} replace />;
};

export default PublicRoute;
