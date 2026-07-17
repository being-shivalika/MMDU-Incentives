import { Fragment } from "react";
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
    <Fragment>
      <section className="bg-[#f8f8f8] py-20">

        <div className="mx-auto max-w-7xl px-6">

          {/* Heading */}

          <div className="text-center">

            <h2 className="text-4xl font-bold text-gray-900">
              Streamlined Claim Lifecycle
            </h2>

            <p className="mt-4 text-lg text-gray-500">
              From submission to disbursement, transparency at every step.
            </p>

          </div>

          {/* Timeline */}

          <div className="mt-20 overflow-x-auto">

            <div className="relative flex min-w-275 items-start justify-between pb-4">

              {/* Horizontal Line */}

              <div className="absolute left-14 right-14 top-7 h-0.5 bg-gray-200"></div>

              {workflowSteps.map((step, index) => (

                <div
                  key={index}
                  className="relative z-10 flex w-36 flex-col items-center text-center"
                >

                  {/* Circle */}

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300
                      ${
                        step.status === "active"
                          ? "border-black bg-black text-white"
                          : step.status === "completed"
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                  >

                    {step.status === "completed" ? (
                      <Check size={22} />
                    ) : (
                      step.number
                    )}

                  </div>

                  {/* Text */}

                  <h3
                    className={`mt-5 text-lg font-semibold ${
                      step.status === "completed"
                        ? "text-green-600"
                        : "text-gray-900"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {step.subtitle}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>
    </Fragment>
  );
};

export default Workflow;