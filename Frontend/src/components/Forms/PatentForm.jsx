import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const PatentForm = () => {
  return (
    <SubmissionForm
      title="Patent Submission"
      category="Patent"
      basicFields={{
        title: "Patent Title",
        domain: "Patent Domain",
        dropdown: "Patent Status",
      }}
      dropdownOptions={["Filed", "Published", "Granted"]}
      verificationLabels={{
        first: "Patent Number",
        second: "Patent Office Link",
        third: "Filing Link",
        fourth: "Verification URL",
      }}
    >
      {/* Patent Specific Fields */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Inventor Details" />

        <Input label="Application Number" />

        <Input label="Filing Date" type="date" />

        <Input label="Grant Date" type="date" />

        <Input label="Patent Category" />

        <Input label="Technology Domain" />
      </div>
    </SubmissionForm>
  );
};

export default PatentForm;
