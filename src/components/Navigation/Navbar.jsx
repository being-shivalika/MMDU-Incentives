import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/Images/Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-[#2c2c2c] bg-[#1a1a1a] shadow-md">

        {/* Desktop + Mobile Navbar */}
        <div className="flex h-20 items-center justify-between px-5 lg:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">

            <img
              src={logo}
              alt="MMU Logo"
              className="h-11 w-11 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold text-white">
                MMU <span className="text-[#cba430]">RPMS</span>
              </h1>

              <p className="hidden text-xs uppercase tracking-wider text-gray-400 sm:block">
                Research Promotion Portal
              </p>
            </div>

          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-10 lg:flex">

            <a
              href="#"
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Home
            </a>

            <a
              href="#"
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Research Policies
            </a>

            <a
              href="#"
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Incentives
            </a>

            <a
              href="#"
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Publications
            </a>

            <a
              href="#"
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              FAQ
            </a>

            <a
              href="#"
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Contact
            </a>

          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-4 lg:flex">

            <button className="rounded-xl border border-[#cba430] px-7 py-3 font-semibold text-[#cba430] transition-all duration-300 hover:bg-[#cba430] hover:text-[#1a1a1a]">
              Register
            </button>

            <Link
              to="/login"
              className="rounded-xl bg-[#cba430] px-7 py-3 font-semibold text-[#1a1a1a] shadow transition-all duration-300 hover:bg-[#b89427]"
            >
              Login
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-[#3a3a3a] p-3 text-white transition hover:bg-[#2a2a2a] lg:hidden"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>

        {/* Mobile Menu */}

        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            menuOpen ? "max-h-125" : "max-h-0"
          }`}
        >

          <div className="border-t border-[#2c2c2c] bg-[#1a1a1a] px-6 py-6">

            <div className="flex flex-col gap-5 text-lg font-medium">

              <a
                href="#"
                className="rounded-xl bg-[#2b2615] px-4 py-3 text-[#cba430]"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </a>

              <a
                href="#"
                className="px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => setMenuOpen(false)}
              >
                Research Policies
              </a>

              <a
                href="#"
                className="px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => setMenuOpen(false)}
              >
                Incentives
              </a>

              <a
                href="#"
                className="px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => setMenuOpen(false)}
              >
                Publications
              </a>

              <a
                href="#"
                className="px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => setMenuOpen(false)}
              >
                FAQ
              </a>

              <a
                href="#"
                className="px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>

            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">

              <button className="rounded-xl border border-[#cba430] py-3 font-semibold text-[#cba430] transition hover:bg-[#cba430] hover:text-[#1a1a1a]">
                Register
              </button>

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-[#cba430] py-3 text-center font-semibold text-[#1a1a1a] transition hover:bg-[#b89427]"
              >
                Login
              </Link>

            </div>

          </div>

        </div>

      </nav>
    </>
  );
};

export default Navbar;