import {
  FileText,
  BookOpen,
  ShieldCheck,
  GitBranch,
  BarChart3,
  ScrollText,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Research Claims",
    desc: "Effortlessly file and track reimbursements for conference travel, equipment, and lab supplies with automated budgeting.",
    dark: true,
  },
  {
    icon: BookOpen,
    title: "Publication Registry",
    desc: "Integrated database for indexing journals, books, and conference papers with Scopus and Web of Science synchronization.",
    dark: false,
  },
  {
    icon: ShieldCheck,
    title: "Patent Management",
    desc: "Securely document IP filings, manage renewals, and collaborate with the legal department on commercialization efforts.",
    dark: true,
  },
  {
    icon: GitBranch,
    title: "Approval Workflow",
    desc: "A multi-tier digital signature system ensuring rapid processing of applications through HOD, RPC, and VC offices.",
    dark: false,
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Real-time visualization of research metrics, funding trends, and department-wise performance ranking.",
    dark: true,
  },
  {
    icon: ScrollText,
    title: "Policy Management",
    desc: "Centralized repository for all research guidelines, incentive structures, and ethical compliance documents.",
    dark: false,
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-[#fafafa] py-16 sm:py-20 md:py-24 lg:py-24"
    >
      <div className="mx-5 sm:mx-8 md:mx-10 lg:ml-12 lg:mr-16">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl md:text-[42px] lg:text-5xl">
            Centralized Research Ecosystem
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:mt-5 sm:text-lg sm:leading-8">
            Discover the powerful modules designed to handle every aspect of the
            academic research lifecycle.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-7 xl:grid-cols-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#d81e1e] hover:shadow-lg sm:p-7 lg:min-h-55"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                    item.dark
                      ? "bg-[#1f1f1f] text-white group-hover:bg-black"
                      : "bg-[#d81e1e] text-white"
                  }`}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                <h3 className="mt-5 text-lg font-bold leading-tight text-[#111827] sm:text-xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-[15px] sm:leading-7">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
