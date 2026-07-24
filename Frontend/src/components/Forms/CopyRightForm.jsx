import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const CopyrightForm = ({ formData, handleInputChange, handleAddAuthor, handleRemoveAuthor, onSubmit, onDraft }) => {
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
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    >
      {/* Copyright Specific Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Author / Creator Name" name="authorCreatorName" value={formData?.authorCreatorName || ""} onChange={handleInputChange} />
        <Input label="Registration Date" type="date" name="registrationDate" value={formData?.registrationDate || ""} onChange={handleInputChange} />
        <Input label="Application Number" name="applicationNumber" value={formData?.applicationNumber || ""} onChange={handleInputChange} />
        <Input label="Copyright Category" name="copyrightCategory" value={formData?.copyrightCategory || ""} onChange={handleInputChange} />
        <Input label="Creation Description" name="creationDescription" value={formData?.creationDescription || ""} onChange={handleInputChange} />
        <Input label="Usage / Licensing Details" name="usageDetails" value={formData?.usageDetails || ""} onChange={handleInputChange} />
      </div>
    </SubmissionForm>
  );
};

export default CopyrightForm;
