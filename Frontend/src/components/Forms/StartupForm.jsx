import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const StartupForm = () => {
  return (
    <SubmissionForm
      title="Startup Submission"
      category="Startup"
      basicFields={{
        title: "Startup Name",
        domain: "Startup Domain",
        dropdown: "Startup Stage",
      }}
      dropdownOptions={[
        "Idea Stage",
        "Prototype Stage",
        "Early Revenue",
        "Established Startup",
      ]}
      verificationLabels={{
        first: "Startup Registration Number",
        second: "Startup Website",
        third: "Incubation Link",
        fourth: "Supporting Document Link",
      }}
    >
      {/* Startup Specific Fields */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Founder Name" />

        <Input label="Registration Date" type="date" />

        <Input label="Startup Category" />

        <Input label="Funding Status" />

        <Input label="Incubator / Accelerator Name" />

        <Input label="Revenue Generated" />
      </div>
    </SubmissionForm>
  );
};

export default StartupForm;
