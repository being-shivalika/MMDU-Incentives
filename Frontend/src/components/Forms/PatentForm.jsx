import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";
import FieldTooltip from "../Ui/FieldTooltip";

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
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1">
          <span>Patent Specifics</span>
          <FieldTooltip
            text="Utility Patent Awarded: ₹10,000 cash incentive per MMDU Policy Sec 7.1 & Table 1. Patent rights belong to MMDU; Tech Transfer royalty up to 50% shared with inventors."
            policyLink="/policies"
          />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Inventor Details" 
            tooltip="Name of MMDU faculty/students inventors. Incentive distributed among MMDU staff per Policy Sec 7.1."
            name="inventorDetails" 
            value={formData?.inventorDetails || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Application Number" 
            tooltip="Official patent application number assigned by Patent Office."
            name="applicationNumber" 
            value={formData?.applicationNumber || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Filing Date" 
            tooltip="Date of formal filing with Indian Patent Office / International Authority."
            type="date" 
            name="filingDate" 
            value={formData?.filingDate || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Grant Date" 
            tooltip="Official grant/award date per Patent Journal publication."
            type="date" 
            name="grantDate" 
            value={formData?.grantDate || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Patent Category" 
            tooltip="Utility Patent / Design Patent / Innovation Patent."
            name="patentCategory" 
            value={formData?.patentCategory || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Technology Domain" 
            tooltip="Technical domain of innovation."
            name="technologyDomain" 
            value={formData?.technologyDomain || ""} 
            onChange={handleInputChange} 
          />
          
          <Input 
            label="Filing Link" 
            tooltip="Official IPO / WIPO e-filing receipt or journal URL."
            name="filingLink" 
            value={formData?.filingLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Verification URL" 
            tooltip="Official Patent Office database verification link per Policy Sec 18."
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