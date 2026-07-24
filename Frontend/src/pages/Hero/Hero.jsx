import { ArrowRight, FileText } from "lucide-react";
import heroImage from "../../assets/Images/MMDU.png";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-35 pb-16 md:pt-40 md:pb-24 lg:pt-30 lg:pb-28 h-screen "
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 scale-125 md:scale-110 lg:scale-100"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Left Gradient */}
      <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-black via-black/60 to-transparent md:w-[85%] lg:w-[75%]" />

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-5 flex min-h-[60vh] items-center sm:mx-8 md:mx-10 lg:ml-12 lg:mr-16 lg:min-h-[72vh]">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-block rounded-full border border-[#d81e1e]/40 bg-[#FFE8A3]/10 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white sm:px-2 sm:text-xs sm:tracking-[0.15em] poppins">
            Institutional Research Excellence
          </span>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-semibold leading-[1.15] tracking-tight text-white sm:mt-8 sm:text-5xl md:text-[56px] lg:text-[64px] lg:leading-[1.15] poppins">
            <span className="block lg:whitespace-nowrap">
              Empowering Research
            </span>

            <span className="block lg:whitespace-nowrap">
              <span className="text-[#d81e1e]">Excellence</span> through Digital
            </span>

            <span className="block">Innovation.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-200 sm:mt-8 sm:text-lg poppins-regular sm:leading-8">
            Streamline research claims, manage incentives, monitor publications
            and approvals through MMU's Research Promotion Management System.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="flex w-full items-center justify-center rounded-xl bg-[#d81e1e] px-8 py-4 font-semibold text-black transition-all duration-300 hover:bg-[#8c0404] sm:w-auto">
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </button>

            <button className="flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black sm:w-auto">
              Research Policies
              <FileText className="ml-2" size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
