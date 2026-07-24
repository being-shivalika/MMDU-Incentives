import { Fragment } from "react";
const stats = [
  {
    number: "1200",
    label: "PUBLICATIONS",
    highlight: false,
  },
  {
    number: "350",
    label: "PROJECTS",
    highlight: false,
  },
  {
    number: "250",
    label: "PATENTS",
    highlight: false,
  },
  {
    number: "₹15 Cr+",
    label: "INCENTIVES",
    highlight: true,
  },
];

const Stats = () => {
  return (
    <section
      id="stats"
      className="pt-4 pb-16 sm:pt-6 sm:pb-20 lg:pb-24"
      style={{
        backgroundImage:
          "radial-gradient(rgba(197,195,195,0.3) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="mx-5 sm:mx-8 md:mx-10 lg:ml-12 lg:mr-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="group flex min-h-38 w-full flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-6 py-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#FFE8A3] hover:shadow-xl lg:min-h-45 lg:rounded-[30px]"
            >
              <h2
                className={`text-3xl font-bold sm:text-4xl md:text-5xl ${
                  item.highlight ? "text-[#d81e1e]" : "text-black"
                }`}
              >
                {item.number}
              </h2>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 sm:mt-5 sm:text-sm sm:tracking-[0.3em]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
