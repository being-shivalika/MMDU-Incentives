import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ROUTES } from "../../constants/routes";

const LandingNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (id) => {
    setMenuOpen(false); // Close mobile menu if open
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-[#2c2c2c] bg-[#373737] shadow-md">
        {/* Desktop + Mobile Navbar */}
        <div className="flex h-15 items-center justify-between px-5 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white  flex items-center justify-center shadow-xl">
              <img
                src="/logo.png"
                alt="MMDU"
                className="h-8 w-10 object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl poppins-semibold text-black">
                MMU <span className="text-[#d81e1e]">RPMS</span>
              </h1>

              <p className="hidden text-[10px] uppercase tracking-wider text-gray-400 sm:block">
                Research Promotion Portal
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-10 lg:flex">
            <button
              onClick={() => scrollToSection("hero")}
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("features")}
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Research Policies
            </button>

            <button
              onClick={() => scrollToSection("workflow")}
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Incentives
            </button>

            <button
              onClick={() => scrollToSection("stats")}
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Publications
            </button>

            <button
              onClick={() => scrollToSection("faq")}
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              FAQ
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="font-medium text-gray-300 transition-colors duration-300 hover:text-[#cba430]"
            >
              Contact
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center rounded-lg bg-[#d81e1e] hover:bg-amber-600 px-8 py-3 text-white font-medium  transition"
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
            <div className="flex flex-col gap-5 text-lg font-medium items-start">
              <button
                className="w-full text-left rounded-xl bg-[#2b2615] px-4 py-3 text-[#cba430]"
                onClick={() => scrollToSection("hero")}
              >
                Home
              </button>

              <button
                className="w-full text-left px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => scrollToSection("features")}
              >
                Research Policies
              </button>

              <button
                className="w-full text-left px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => scrollToSection("workflow")}
              >
                Incentives
              </button>

              <button
                className="w-full text-left px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => scrollToSection("stats")}
              >
                Publications
              </button>

              <button
                className="w-full text-left px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => scrollToSection("faq")}
              >
                FAQ
              </button>

              <button
                className="w-full text-left px-4 py-2 text-gray-300 transition hover:text-[#cba430]"
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </button>
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

export default LandingNavbar;
