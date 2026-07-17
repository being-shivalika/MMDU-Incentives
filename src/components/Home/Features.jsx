import { Fragment } from "react";
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
    <Fragment>
      <section className="bg-[#fafafa] py-20 lg:py-24">
        <div className="mx-6 md:mx-10 lg:ml-12 lg:mr-16">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[#111827] lg:text-5xl">
              Centralized Research Ecosystem
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-500">
              Discover the powerful modules designed to handle every aspect of
              the academic research lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="group min-h-55 rounded-[28px] border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#cba430] hover:shadow-lg"
                >
                  <div
  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
    item.dark
      ? "bg-[#1f1f1f] text-white group-hover:bg-black"
      : "bg-[#cba430] text-white group-hover:bg-[#cba430]"
  }`}
>
  <Icon size={18} strokeWidth={2.2} />
</div>

                  <h3 className="mt-5 text-[18px] font-bold leading-tight text-[#111827]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Features;
