import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { GraduationCap, Settings, LogOut } from "lucide-react";
import { NAV } from "../../constants/nav";
import { useRole } from "../../app/providers/RoleProvider";

export default function Sidebar() {
  const { role, basePath } = useRole();
  const items = NAV[role];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5 lg:flex">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <GraduationCap size={19} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight text-slate-900">MMDU</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Research Incentives
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="block">
            {({ isActive }) => (
              <div
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-slate-900"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon size={18} className="relative z-10" strokeWidth={2} />
                <span className="relative z-10 flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={`relative z-10 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-slate-100 pt-3">
        <NavLink to={`${basePath}/settings`} className="block">
          {({ isActive }) => (
            <div
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Settings size={18} />
              Settings
            </div>
          )}
        </NavLink>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
