import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // No role restriction
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  const currentRole = user.role?.toLowerCase();

  const hasAccess = allowedRoles
    .map((role) => role.toLowerCase())
    .includes(currentRole);

  if (!hasAccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>

        <p className="mt-3 text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
