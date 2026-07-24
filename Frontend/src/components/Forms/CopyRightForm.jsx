import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const CopyrightForm = () => {
  return (
    <SubmissionForm
      title="Copyright Submission"
      category="Copyright"
      basicFields={{
        title: "Copyright Title",
        domain: "Creative / Research Domain",
        dropdown: "Copyright Type",
      }}
      dropdownOptions={[
        "Software",
        "Literary Work",
        "Research Material",
        "Digital Content",
        "Other",
      ]}
      verificationLabels={{
        first: "Copyright Registration Number",
        second: "Registration Portal Link",
        third: "Ownership Proof Link",
        fourth: "Supporting Document Link",
      }}
    >
      {/* Copyright Specific Fields */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Author / Creator Name" />

        <Input label="Registration Date" type="date" />

        <Input label="Application Number" />

        <Input label="Copyright Category" />

        <Input label="Creation Description" />

        <Input label="Usage / Licensing Details" />
      </div>
    </SubmissionForm>
  );
};

export default CopyrightForm;
