import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const StartupForm = ({ formData, handleInputChange, handleAddAuthor, handleRemoveAuthor, onSubmit, onDraft }) => {
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
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    >
      {/* Startup Specific Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Founder Name" name="founderName" value={formData?.founderName || ""} onChange={handleInputChange} />
        <Input label="Registration Date" type="date" name="registrationDate" value={formData?.registrationDate || ""} onChange={handleInputChange} />
        <Input label="Startup Category" name="startupCategory" value={formData?.startupCategory || ""} onChange={handleInputChange} />
        <Input label="Funding Status" name="fundingStatus" value={formData?.fundingStatus || ""} onChange={handleInputChange} />
        <Input label="Incubator / Accelerator Name" name="incubatorName" value={formData?.incubatorName || ""} onChange={handleInputChange} />
        <Input label="Revenue Generated" name="revenueGenerated" value={formData?.revenueGenerated || ""} onChange={handleInputChange} />
      </div>
    </SubmissionForm>
  );
};

export default StartupForm;
