import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";
import FieldTooltip from "../Ui/FieldTooltip";

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
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
          <span>Copyright Specifics</span>
          <FieldTooltip
            text="Copyright filing cost is borne by MMDU. In case of commercial Transfer, royalty earned is shared up to 50% with author(s) per Policy Sec 7.1."
            policyLink="/policies"
          />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Author / Creator Name" 
            tooltip="Name of MMDU faculty/student creators."
            name="authorCreatorName" 
            value={formData?.authorCreatorName || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Registration Date" 
            tooltip="Date of copyright registration per Copyright Office."
            type="date" 
            name="registrationDate" 
            value={formData?.registrationDate || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Application Number" 
            tooltip="Official Copyright Office application number."
            name="applicationNumber" 
            value={formData?.applicationNumber || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Copyright Category" 
            tooltip="Software / Literary Work / Research Material."
            name="copyrightCategory" 
            value={formData?.copyrightCategory || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Creation Description" 
            tooltip="Brief description of copyrighted work."
            name="creationDescription" 
            value={formData?.creationDescription || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Usage / Licensing Details" 
            tooltip="Commercial licensing or academic usage details."
            name="usageDetails" 
            value={formData?.usageDetails || ""} 
            onChange={handleInputChange} 
          />
          
          <Input 
            label="Ownership Proof Link" 
            tooltip="Copyright certificate link or official portal entry."
            name="ownershipProofLink" 
            value={formData?.ownershipProofLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Supporting Document Link" 
            tooltip="Supporting document or diary number proof link per Policy Sec 18."
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