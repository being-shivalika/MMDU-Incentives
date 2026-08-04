import {
  ArrowRight,
  FileText,
  ChartNoAxesColumnIncreasing,
  BadgeCheck,
  FileUp,
  FilePenLine,
  CircleCheckBig,
  Banknote,
} from "lucide-react";

const Hero = () => {
  const steps = [
    {
      number: "01",
      title: "Submit",
      description: "Upload your research documents and data securely.",
      icon: FileUp,
    },
    {
      number: "02",
      title: "Review",
      description: "Peer and administrative review conducted via portal.",
      icon: FilePenLine,
    },
    {
      number: "03",
      title: "Approve",
      description: "Formal acceptance of performance records.",
      icon: CircleCheckBig,
    },
    {
      number: "04",
      title: "Reward",
      description: "Recognition and financial incentives distributed.",
      icon: Banknote,
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative w-full overflow-hidden bg-[#fafafa] font-['Poppins']"
      >
        {/* Desktop Image Section */}
        <div className="absolute right-0 top-0 hidden h-180 w-[54%] lg:block">
          <img
            src="/assets/images/hero-student.png"
            alt="Student"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fafafa] to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col px-5 pb-12 pt-14 sm:px-8 sm:pt-16 lg:min-h-180 lg:justify-center lg:px-10 lg:pb-48 lg:pt-16 xl:px-12">
          {/* Main Copy */}
          <div className="relative z-10 w-full lg:w-[50%] xl:w-[48%]">
            {/* Badge / Tagline */}
            <div className="inline-flex items-center border-l-[3px] border-[#cba430] pl-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9a7b14] sm:text-[11px]">
                Research Management
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-5 max-w-xl text-[38px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#1a1a1a] sm:text-[48px] md:text-[52px] lg:text-[54px] xl:text-[60px] 2xl:text-[64px]">
              One Platform.
              <span className="block text-[#cba430]">Complete Research</span>
              <span className="block">Management.</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-500 sm:text-[15px]">
              Submit, review and track research through one connected platform.
            </p>

            {/* Call to Action */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#1a1a1a] px-6 py-3.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#cba430]"
              >
                Explore RPMS
                <ArrowRight size={17} strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Mobile / Tablet Image */}
          <div className="relative mt-10 w-full overflow-hidden lg:hidden">
            <img
              src="/assets/images/hero-student.png"
              alt="Student"
              className="h-85 w-full object-cover object-center sm:h-110 md:h-125"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/50 to-transparent" />
          </div>
        </div>

        {/* Floating Feature Strip - Desktop */}
        <div className="absolute bottom-6 left-1/2 z-30 hidden w-[calc(100%-40px)] max-w-[1440px] -translate-x-1/2 lg:block">
          <div className="grid grid-cols-[1fr_1fr_1fr_245px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <FeatureItem
              icon={FileText}
              title="Research Submissions"
              description="Streamlined portal for all your scholarly work submissions."
            />
            <FeatureItem
              icon={ChartNoAxesColumnIncreasing}
              title="Publication Tracking"
              description="Monitor citation counts and impact factors in real-time."
            />
            <FeatureItem
              icon={BadgeCheck}
              title="Approval Workflow"
              description="Automated multi-tier administrative approval cycles."
            />
            <QuickOverview />
          </div>
        </div>

        {/* Floating Feature Strip - Mobile / Tablet */}
        <div className="relative z-30 mx-5 mb-10 sm:mx-8 lg:hidden">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <FeatureItem
              icon={FileText}
              title="Research Submissions"
              description="Streamlined portal for scholarly work submissions."
            />
            <FeatureItem
              icon={ChartNoAxesColumnIncreasing}
              title="Publication Tracking"
              description="Monitor publications and research impact."
            />
            <FeatureItem
              icon={BadgeCheck}
              title="Approval Workflow"
              description="Simplified multi-level research approvals."
            />
            <QuickOverview />
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section
        id="workflow"
        className="w-full bg-white px-5 py-16 font-['Poppins'] sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="text-center">
            <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[36px] lg:text-[40px]">
              Research Made Simple
            </h2>
            <div className="mx-auto mt-4 h-1 w-12 bg-[#cba430]" />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:mt-16 lg:grid-cols-4 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group flex cursor-pointer flex-col items-center text-center"
                >
                  <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full border border-gray-200 bg-white text-[18px] font-semibold text-gray-300 shadow-lg transition-all duration-300 group-hover:border-[#cba430] group-hover:text-[#cba430] sm:h-[82px] sm:w-[82px]">
                    {step.number}
                  </div>

                  <div className="mt-5 flex items-center justify-center text-[#b7b7b7] transition-colors duration-300 group-hover:text-[#cba430]">
                    <Icon size={27} strokeWidth={2} />
                  </div>

                  <h3 className="mt-4 text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                    {step.title}
                  </h3>

                  <p className="mt-2 max-w-[230px] text-[12px] leading-[1.6] text-gray-600 sm:text-[13px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

/* FEATURE ITEM COMPONENT */
const FeatureItem = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex min-h-[155px] flex-col justify-center border-b border-gray-200 px-6 py-6 sm:px-7 lg:border-b-0 lg:border-r lg:px-7">
      <Icon size={17} strokeWidth={1.8} className="text-[#cba430]" />
      <h3 className="mt-4 text-[14px] font-semibold text-[#111111] xl:text-[15px]">
        {title}
      </h3>
      <p className="mt-2 max-w-[250px] text-[11px] leading-[1.6] text-gray-600 xl:text-[12px]">
        {description}
      </p>
    </div>
  );
};

/* QUICK OVERVIEW COMPONENT */
const QuickOverview = () => {
  return (
    <div className="min-h-[180px] bg-[#050505] px-6 py-6 text-white lg:min-h-[155px] lg:px-6 lg:py-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#d5aa19]">
        Quick Overview
      </p>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 lg:mt-4 lg:gap-x-5 lg:gap-y-4">
        <div>
          <p className="text-xl font-semibold leading-none">1200+</p>
          <p className="mt-1.5 text-[7px] uppercase text-gray-400">
            Publications
          </p>
        </div>

        <div>
          <p className="text-xl font-semibold leading-none">350+</p>
          <p className="mt-1.5 text-[7px] uppercase text-gray-400">Projects</p>
        </div>

        <div>
          <p className="text-xl font-semibold leading-none">250+</p>
          <p className="mt-1.5 text-[7px] uppercase text-gray-400">Patents</p>
        </div>

        <div>
          <p className="text-xl font-semibold leading-none text-[#d5aa19]">
            ₹15 Cr+
          </p>
          <p className="mt-1.5 text-[7px] uppercase text-gray-400">
            Incentives
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
