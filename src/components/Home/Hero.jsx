import { Fragment } from "react";
import { ArrowRight, FileText } from "lucide-react";
import heroImage from "../../assets/Images/MMDU.png";

const Hero = () => {
  return (
    <Fragment>
      <section className="relative overflow-hidden pt-36 pb-28 md:pt-44 lg:pt-52">

        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Left Side Gradient */}
        <div className="absolute inset-y-0 left-0 w-[75%] bg-linear-to-r from-[#000000]/95 via-[#000000]/75 via-50% to-transparent" />

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-6 flex min-h-[72vh] items-center md:mx-10 lg:ml-12 lg:mr-16">
          <div className="max-w-3xl">

            {/* Badge */}
            <span className="inline-block rounded-full border border-[#FFE8A3]/40 bg-[#FFE8A3]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#cba430] sm:px-5 sm:text-xs sm:tracking-[0.15em]">
              Institutional Research Excellence
            </span>

            {/* Heading */}
            <h1 className="mt-8 text-[42px] font-bold leading-tight tracking-tight text-white sm:text-[52px] lg:text-[64px] lg:leading-[1.15]">

              <span className="block lg:whitespace-nowrap">
                Empowering Research
              </span>

              <span className="block lg:whitespace-nowrap">
                <span className="text-[#cba430]">Excellence</span> through Digital
              </span>

              <span className="block">
                Innovation.
              </span>

            </h1>

            {/* Description */}
            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-200">
              Streamline research claims, manage incentives, monitor
              publications and approvals through MMU's Research Promotion
              Management System.
            </p>

            {/* Buttons */}
            <div className="mt-12 flex flex-col gap-5 sm:flex-row">

              <button className="flex items-center justify-center rounded-xl bg-[#cba430] px-8 py-4 font-semibold text-black transition-all duration-300 hover:bg-[#cba430]">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </button>

              <button className="flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black">
                Research Policies
                <FileText className="ml-2" size={18} />
              </button>

            </div>

          </div>
        </div>

      </section>
    </Fragment>
  );
};

export default Hero;