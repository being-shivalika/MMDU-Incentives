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
    <>
      <section
        className="pb-16 pt-6 md:pb-20 lg:pb-24"
        style={{
          backgroundImage:
            "radial-gradient(rgba(197,195,195,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-6 md:mx-10 lg:ml-12 lg:mr-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <div
                key={index}
                className="group flex h-42.5 w-full flex-col items-center justify-center rounded-[30px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#FFE8A3] hover:shadow-xl"
              >
                <h2
                  className={`text-4xl font-bold md:text-5xl ${
                    item.highlight ? "text-[#cba430]" : "text-black"
                  }`}
                >
                  {item.number}
                </h2>

                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.35em] text-gray-600">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Stats;