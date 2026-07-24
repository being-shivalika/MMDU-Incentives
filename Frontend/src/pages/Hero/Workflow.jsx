import { Check } from "lucide-react";

const workflowSteps = [
  {
    number: 1,
    title: "Faculty",
    subtitle: "Submission",
    status: "active",
  },
  {
    number: 2,
    title: "HOD",
    subtitle: "Verification",
    status: "pending",
  },
  {
    number: 3,
    title: "RPC",
    subtitle: "Academic Audit",
    status: "pending",
  },
  {
    number: 4,
    title: "Finance",
    subtitle: "Budget Check",
    status: "pending",
  },
  {
    number: 5,
    title: "Accounts",
    subtitle: "Processing",
    status: "pending",
  },
  {
    number: 6,
    title: "VC",
    subtitle: "Final Approval",
    status: "pending",
  },
  {
    number: "",
    title: "Released",
    subtitle: "Disbursement",
    status: "completed",
  },
];

const Workflow = () => {
  return (
    <section id="workflow" className="bg-[#f8f8f8] py-16 sm:py-20 lg:py-20">
      <div className="mx-5 sm:mx-8 md:mx-10 lg:mx-auto lg:max-w-7xl">
        {/* Heading */}

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Streamlined Claim Lifecycle
          </h2>

          <p className="mt-4 text-base text-gray-500 sm:text-lg">
            From submission to disbursement, transparency at every step.
          </p>
        </div>

        {/* Timeline */}

        <div className="mt-14 overflow-x-auto pb-4">
          <div className="relative flex min-w-215 items-start justify-between lg:min-w-0 lg:justify-between">
            {/* Line */}

            <div className="absolute left-14 right-14 top-7 h-0.5 bg-gray-200"></div>

            {workflowSteps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex w-32 shrink-0 flex-col items-center text-center sm:w-36"
              >
                {/* Circle */}

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-bold transition-all duration-300 sm:h-14 sm:w-14 sm:text-lg
                    ${
                      step.status === "active"
                        ? "border-black bg-black text-white"
                        : step.status === "completed"
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white text-gray-600"
                    }`}
                >
                  {step.status === "completed" ? (
                    <Check size={20} />
                  ) : (
                    step.number
                  )}
                </div>

                {/* Text */}

                <h3
                  className={`mt-4 text-base font-semibold sm:text-lg ${
                    step.status === "completed"
                      ? "text-green-600"
                      : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  {step.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
