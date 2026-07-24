import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

const Sidebar = ({
  title = "Menu",
  navItems = [],
  isCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  children,
}) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  // Automatically keep dropdown open if any child item is active on page load/navigation
  useEffect(() => {
    navItems.forEach((item, index) => {
      if (item.isDropdown && item.subItems) {
        const isChildActive = item.subItems.some(
          (sub) => sub.path === location.pathname,
        );
        if (isChildActive) {
          setOpenDropdown(index);
        }
      }
    });
  }, [location.pathname, navItems]);

  const closeMobileSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      <aside
      className={`
        fixed top-16 left-0 z-50
        h-[calc(100vh-4rem)]
        bg-gray-50
        border-r border-gray-200
        shadow-lg
        transition-all duration-300 ease-in-out
        w-72
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-20" : "lg:w-72"}
      `}
    >
      <div className="flex h-full flex-col justify-between px-4 py-8">
        <div>
          <h1
            className={`mb-8 px-2 text-2xl font-bold transition-all duration-200 ${
              isCollapsed
                ? "hidden lg:block lg:h-0 lg:overflow-hidden lg:opacity-0"
                : "opacity-100"
            }`}
          >
            {title}
          </h1>

          <nav className="flex flex-col gap-2">
            {navItems.map((item, index) => {
              if (item.isDropdown) {
                const isOpen = openDropdown === index;

                // Reactively check if current URL matches any subItem path
                const hasActiveChild = item.subItems?.some((sub) =>
                  sub.isActive
                    ? sub.isActive(location)
                    : location.pathname === sub.path ||
                      (sub.path !== "/" && location.pathname.startsWith(sub.path)),
                );

                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : index)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-3 transition-all ${
                        hasActiveChild
                          ? "bg-black text-white"
                          : "text-black hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>

                      {!isCollapsed &&
                        (isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        ))}
                    </button>

                    {isOpen && !isCollapsed && (
                      <div className="ml-8 mt-2 flex flex-col gap-1">
                        {item.subItems.map((sub) => (
                          <NavLink
                            key={sub.path}
                            to={sub.path}
                            end
                            onClick={closeMobileSidebar}
                            className={({ isActive }) =>
                              `rounded-md px-3 py-2 text-sm transition-all ${
                                isActive
                                  ? "bg-black text-white font-medium"
                                  : "hover:bg-gray-200 text-gray-700"
                              }`
                            }
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={closeMobileSidebar}
                  className={({ isActive: isRouterActive }) => {
                    const isItemActive = item.isActive
                      ? item.isActive(location)
                      : isRouterActive || (!item.end && item.path !== "/" && location.pathname.startsWith(item.path));

                    return `flex items-center gap-4 rounded-lg px-3 py-3 transition-all ${
                      isItemActive
                        ? "bg-black text-white"
                        : "text-black hover:bg-gray-200"
                    }`;
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mb-10">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className={`flex w-full items-center justify-center gap-3 rounded-lg bg-black py-3 font-semibold text-white transition-all ${
              isCollapsed ? "lg:px-0" : "px-4"
            }`}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </motion.button>
        </div>
      </div>
    </aside>
    
      {/* Main Content */}
      {children && (
        <main
          className={`flex-1 p-8 transition-all duration-300 ease-in-out
            ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}
            ml-0
          `}
        >
          {children}
        </main>
      )}
    </>
  );
};

export default Sidebar;
