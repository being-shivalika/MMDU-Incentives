import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Navbar = ({ onToggleSidebar, onOpenMobileSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-800 bg-[#f5f3f3]">
      <div className="flex h-full items-center justify-between px-3">
        <div className="flex items-center gap-3">
          {/* Desktop Toggle */}
          <button
            onClick={onToggleSidebar}
            className="hidden rounded-lg p-2 transition hover:bg-white/10 lg:block"
          >
            <Menu className="h-5 w-5 text-black" />
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={onOpenMobileSidebar}
            className="rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>

          {/* Logo */}
          <div className="flex h-12 w-12 border border-[#9f9e9e] items-center justify-center rounded-full bg-white shadow">
            <img
              src="/logo.png"
              alt="MMDU"
              className="h-8 w-10 object-contain"
            />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-sm font-semibold text-black">MMU RPMS</h1>

            <p className="text-xs text-gray-400 hidden lg:block">
              Research Portal Management System
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <div className="mr-6 text-right">
            <p className="text-sm font-medium text-black">{user?.name}</p>

            <p className="text-xs uppercase text-gray-600">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
