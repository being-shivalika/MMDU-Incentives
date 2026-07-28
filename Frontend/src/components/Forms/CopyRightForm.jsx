import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const CopyrightForm = ({ 
  formData, 
  handleInputChange, 
  handleAddAuthor, 
  handleRemoveAuthor, 
  onSubmit, 
  onDraft 
}) => {
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
          Copyright Specifics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Author / Creator Name" 
            name="authorCreatorName" 
            value={formData?.authorCreatorName || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Registration Date" 
            type="date" 
            name="registrationDate" 
            value={formData?.registrationDate || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Application Number" 
            name="applicationNumber" 
            value={formData?.applicationNumber || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Copyright Category" 
            name="copyrightCategory" 
            value={formData?.copyrightCategory || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Creation Description" 
            name="creationDescription" 
            value={formData?.creationDescription || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Usage / Licensing Details" 
            name="usageDetails" 
            value={formData?.usageDetails || ""} 
            onChange={handleInputChange} 
          />
          
          {/* Shifted these here to ensure they render, as SubmissionForm only handles 2 verification links natively */}
          <Input 
            label="Ownership Proof Link" 
            name="ownershipProofLink" 
            value={formData?.ownershipProofLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Supporting Document Link" 
            name="supportingDocumentLink" 
            value={formData?.supportingDocumentLink || ""} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
    </SubmissionForm>
  );
};

export default CopyrightForm;