import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Bell, Search, ChevronDown, ArrowLeftRight } from "lucide-react";
import { useRole } from "../../app/providers/RoleProvider";
import { ROLES } from "../../constants/roles";

export default function Topbar({ title, subtitle, notifCount = 0, showSearch = false }) {
  const { role, setRole, meta } = useRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function switchRole() {
    const nextRole = role === ROLES.FACULTY ? ROLES.RCP : ROLES.FACULTY;
    setRole(nextRole);
    navigate(`/${nextRole}/dashboard`);
    setOpen(false);
  }

  return (
    <header className="flex items-center gap-4 border-b border-slate-200 bg-white/80 px-4 py-3.5 backdrop-blur lg:px-6">
      <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
      </div>

      {showSearch && (
        <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 md:flex">
          <Search size={16} />
          <span className="truncate">Search claims, faculty, departments...</span>
        </div>
      )}

      <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
        <Bell size={20} />
        {notifCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
            {notifCount}
          </span>
        )}
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {meta.initials}
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-800">{meta.name}</p>
            <p className="text-xs text-slate-400">{meta.title}</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
            >
              <div className="px-2.5 py-2 text-xs text-slate-400">Signed in as {meta.label}</div>
              <button
                onClick={switchRole}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeftRight size={16} />
                Switch to {role === ROLES.FACULTY ? "RCP" : "Faculty"} view
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
