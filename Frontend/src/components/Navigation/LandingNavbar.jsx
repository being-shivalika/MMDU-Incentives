import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { ROUTES } from "../../constants/routes";

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="relative z-50 w-full border-b border-gray-200 bg-white font-['Poppins']">
        <div className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-7 lg:px-10">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src="/logo.png"
              alt="MMU Logo"
              className="h-11 w-11 object-contain"
            />

            <div>
              <h1 className="text-lg font-semibold leading-none text-[#1a1a1a]">
                MMU <span className="text-[#8C0404]">RPMS</span>
              </h1>

              <p className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.08em] text-gray-500 sm:block">
                Research Promotion Portal
              </p>
            </div>
          </Link>

          {/* Desktop Login Button */}
          <div className="hidden shrink-0 xl:flex">
            <Link
              to={ROUTES.LOGIN}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-[#8C0404]
                px-6
                py-3
                text-[13px]
                font-semibold
                text-white
                transition
                duration-200
                hover:bg-[#6F0303]
              "
            >
              Login
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              border
              border-gray-200
              text-[#1a1a1a]
              xl:hidden
            "
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="border-t border-gray-200 bg-white px-5 pb-6 pt-4 xl:hidden">
            <Link
              to={ROUTES.LOGIN}
              onClick={() => setMenuOpen(false)}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#8C0404]
                hover:bg-[#6F0303]
                py-3
                text-sm
                font-semibold
                text-white
                transition-colors
              "
            >
              Login
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default LandingNavbar;
