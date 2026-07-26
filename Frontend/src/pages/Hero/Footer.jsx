const Footer = () => {
  return (
    <>
      <footer className="bg-[#1a1a1a] font-['Poppins']">
        <div
          className="
            mx-auto
            flex
            max-w-325
            flex-col
            gap-4
            px-5
            py-6
            sm:px-8
            md:flex-row
            md:items-center
            md:justify-between
            lg:px-12
          "
        >
          <p className="text-[10px] text-gray-500">
            © 2026 MMU Research Promotion Management System
          </p>

          <div className="flex flex-wrap gap-6 text-[11px] text-gray-400">
            <a
              href="#"
              className="transition-colors duration-200 hover:text-[#cba430]"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors duration-200 hover:text-[#cba430]"
            >
              Terms
            </a>

            <a
              href="#contact"
              className="transition-colors duration-200 hover:text-[#cba430]"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
