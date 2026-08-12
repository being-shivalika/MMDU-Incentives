import { NavLink, useLocation } from "react-router-dom";
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
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-800/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 z-50
          flex flex-col
          h-[calc(100vh-4rem)]
          bg-[#F3F3F1]
          border-r border-neutral-200/60
          transition-all duration-300 ease-in-out
          w-64
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-5 py-6 shrink-0 border-b border-transparent">
            <h1
              className={`text-2xl font-bold tracking-tight text-neutral-800 transition-all duration-200 whitespace-nowrap ${
                isCollapsed
                  ? "lg:w-0 lg:opacity-0 lg:overflow-hidden"
                  : "w-full opacity-100"
              }`}
            >
              {title}
            </h1>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item, index) => {
                if (item.isDropdown) {
                  const isOpen = openDropdown === index;

                  const hasActiveChild = item.subItems?.some((sub) =>
                    sub.isActive
                      ? sub.isActive(location)
                      : location.pathname === sub.path ||
                        (sub.path !== "/" &&
                          location.pathname.startsWith(sub.path)),
                  );

                  return (
                    <div key={item.label} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? null : index)}
                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                          hasActiveChild
                            ? "bg-[#2B2B2B] text-white font-semibold shadow-sm"
                            : "text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={`h-5 w-5 shrink-0 transition-colors ${hasActiveChild ? "text-white" : "text-neutral-500 group-hover:text-neutral-800"}`}
                          />
                          {!isCollapsed && <span>{item.label}</span>}
                        </div>

                        {!isCollapsed && (
                          <div className="shrink-0">
                            {isOpen ? (
                              <ChevronDown
                                className={`h-4 w-4 ${hasActiveChild ? "text-white/80" : "text-neutral-400"}`}
                              />
                            ) : (
                              <ChevronRight
                                className={`h-4 w-4 ${hasActiveChild ? "text-white/80" : "text-neutral-400"}`}
                              />
                            )}
                          </div>
                        )}
                      </button>

                      {!isCollapsed && (
                        <div
                          className={`grid transition-all duration-200 ease-in-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100 mt-1"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden flex flex-col gap-0.5">
                            {item.subItems.map((sub) => (
                              <NavLink
                                key={sub.path}
                                to={sub.path}
                                end
                                onClick={closeMobileSidebar}
                                className={({ isActive }) =>
                                  `flex items-center rounded-lg pl-11 pr-3 py-2 text-sm transition-all duration-200 ${
                                    isActive
                                      ? "bg-[#2B2B2B] text-white font-semibold shadow-sm"
                                      : "text-neutral-600 hover:bg-neutral-200/40 hover:text-neutral-900 font-medium"
                                  }`
                                }
                              >
                                {sub.label}
                              </NavLink>
                            ))}
                          </div>
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
                      const hasExactSiblingMatch = navItems.some(
                        (n) => n.path && n.path === location.pathname
                      );
                      const isExactMatch = location.pathname === item.path;
                      const isSubPathMatch = !item.end && !hasExactSiblingMatch && item.path !== "/" && location.pathname.startsWith(item.path + "/");
                      const isItemActive = item.isActive
                        ? item.isActive(location)
                        : (item.end ? isExactMatch : isExactMatch || isSubPathMatch);

                      return `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                        isItemActive
                          ? "bg-[#2B2B2B] text-white font-semibold shadow-sm"
                          : "text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900 font-medium"
                      }`;
                    }}
                  >
                    {({ isActive: isRouterActive }) => {
                      const hasExactSiblingMatch = navItems.some(
                        (n) => n.path && n.path === location.pathname
                      );
                      const isExactMatch = location.pathname === item.path;
                      const isSubPathMatch = !item.end && !hasExactSiblingMatch && item.path !== "/" && location.pathname.startsWith(item.path + "/");
                      const isItemActive = item.isActive
                        ? item.isActive(location)
                        : (item.end ? isExactMatch : isExactMatch || isSubPathMatch);

                      return (
                        <>
                          <Icon
                            className={`h-5 w-5 shrink-0 transition-colors ${isItemActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-800"}`}
                          />
                          {!isCollapsed && <span>{item.label}</span>}
                        </>
                      );
                    }}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4 shrink-0 border-t border-neutral-200/60">
            <button
              onClick={logout}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-100 hover:border-neutral-300 py-2.5 text-sm font-semibold text-neutral-800 transition-all duration-200 ${
                isCollapsed ? "lg:px-0" : "px-3"
              }`}
            >
              <LogOut className="h-4 w-4 shrink-0 text-neutral-500" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      {children && (
        <main
          className={`flex-1 min-w-0 transition-all duration-300 ease-in-out bg-white min-h-screen
            ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
            ml-0 pt-16 lg:pt-0
          `}
        >
          <div className="p-6 md:p-8">{children}</div>
        </main>
      )}
    </>
  );
};

export default Sidebar;
