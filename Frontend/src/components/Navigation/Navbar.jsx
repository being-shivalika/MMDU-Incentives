import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Navbar = ({ onToggleSidebar, onOpenMobileSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-[#8C0404] backdrop-blur-md shadow-xs transition-all">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Desktop Toggle */}
          <button
            onClick={onToggleSidebar}
            className="hidden rounded-xl p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:block cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={onOpenMobileSidebar}
            className="rounded-xl p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden cursor-pointer"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div className="flex h-10 w-10 border border-neutral-200 items-center justify-center rounded-xl bg-white shadow-xs">
            <img
              src="/logo.png"
              alt="MMDU"
              className="h-7 w-7 object-contain"
            />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white">MMDU RPMS</h1>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 hidden lg:block">
              Research Portal Management System
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">
            <div className="h-7 w-7 rounded-lg bg-white text-[#8C0404] font-bold text-xs flex items-center justify-center uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white leading-none mb-0.5">{user?.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 leading-none">
                {user?.role?.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
