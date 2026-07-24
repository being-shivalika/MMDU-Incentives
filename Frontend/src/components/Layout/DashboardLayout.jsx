import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navigation/Navbar";
import {
  navigationConfig,
  ROLE_TO_NAV_KEY,
  ROLE_TITLES,
} from "../Navigation/navigationConfig";
import ApplicantsSidebar from "../../pages/Teachers/Dashboard/components/ApplicantsSidebar";
import DepartmentReviewSidebar from "../../pages/DepartmentReview/Dashboard/components/DepartmentReviewSidebar";
import Sidebar from "../Navigation/Sidebar";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth();

  // Desktop sidebar (collapse/expand)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mobile sidebar (open/close)
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const navKey = user?.role ? ROLE_TO_NAV_KEY[user.role] : "";
  const navItems = navKey ? navigationConfig[navKey] || [] : [];
  const sidebarTitle = user?.role ? ROLE_TITLES[user.role] : "Dashboard";

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
      <Navbar
        onToggleSidebar={toggleSidebar}
        onOpenMobileSidebar={() => setIsMobileOpen(true)}
      />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="flex pt-16">
        {/* Sidebar as Layout */}
        {user?.role === "hod" ? (
          <DepartmentReviewSidebar
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            role={user?.role}
            navItems={navItems}
            title={sidebarTitle}
          >
            <Outlet />
          </DepartmentReviewSidebar>
        ) : ["rpc_cell", "rd_cell"].includes(user?.role) ? (
          <Sidebar
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            navItems={navItems}
            title={sidebarTitle}
          >
            <Outlet />
          </Sidebar>
        ) : (
          <ApplicantsSidebar
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            role={user?.role}
            navItems={navItems}
            title={sidebarTitle}
          >
            <Outlet />
          </ApplicantsSidebar>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
