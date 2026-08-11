import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import FirstLoginPasswordModal from "../../components/Ui/FirstLoginPasswordModal";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, isAuthenticated, updateUser } = useAuth();

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

  // First time login password change mandatory modal
  if (user.isFirstLogin === true) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <FirstLoginPasswordModal
          isOpen={true}
          user={user}
          updateUser={updateUser}
          onSuccess={() => {}}
        />
      </div>
    );
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
