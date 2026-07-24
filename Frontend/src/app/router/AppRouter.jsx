import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import routeConfig from "./RouteConfig";

import { ROUTES } from "../../constants/routes";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import LandingLayout from "../../components/Layout/LandingLayout";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.LOGIN} replace />}
        />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<LandingLayout />}>
            {routeConfig.publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Route>

        {/* Protected Routes */}
        {routeConfig.protectedRouteGroups.map(
          ({ allowedRoles, routes }, index) => (
            <Route
              key={index}
              element={<ProtectedRoute allowedRoles={allowedRoles} />}
            >
              <Route element={<DashboardLayout />}>
                {routes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Route>
            </Route>
          ),
        )}

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center text-xl font-semibold">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
