import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const PatentForm = ({ 
  formData, 
  handleInputChange, 
  handleAddAuthor, 
  handleRemoveAuthor, 
  onSubmit, 
  onDraft 
}) => {
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
      }}
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    >
      <div className="flex flex-col gap-5">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          Patent Specifics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Inventor Details" 
            name="inventorDetails" 
            value={formData?.inventorDetails || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Application Number" 
            name="applicationNumber" 
            value={formData?.applicationNumber || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Filing Date" 
            type="date" 
            name="filingDate" 
            value={formData?.filingDate || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Grant Date" 
            type="date" 
            name="grantDate" 
            value={formData?.grantDate || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Patent Category" 
            name="patentCategory" 
            value={formData?.patentCategory || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Technology Domain" 
            name="technologyDomain" 
            value={formData?.technologyDomain || ""} 
            onChange={handleInputChange} 
          />
          
          {/* Shifted these here to ensure they render, as SubmissionForm only handles 2 verification links natively */}
          <Input 
            label="Filing Link" 
            name="filingLink" 
            value={formData?.filingLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Verification URL" 
            name="verificationUrl" 
            value={formData?.verificationUrl || ""} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
    </SubmissionForm>
  );
};

export default PatentForm;