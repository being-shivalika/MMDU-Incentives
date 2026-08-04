import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const BookSectionForm = ({ 
  formData, 
  handleInputChange, 
  handleAddAuthor, 
  handleRemoveAuthor, 
  onSubmit, 
  onDraft 
}) => {
  return (
    <SubmissionForm
      title="Book Section Submission"
      category="Book Section"
      basicFields={{
        title: "Section Heading / Title",
        domain: "Subject Area / Domain",
        dropdown: "Section Indexing Tier",
      }}
      dropdownOptions={[
        "Scopus / WoS Indexed Section",
        "International Reference Section",
        "National Book Section",
        "Peer-Reviewed Section",
      ]}
      verificationLabels={{
        first: "ISBN Number",
        second: "Section Web / DOI Link",
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
          Book Section Specifics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Book Title (Reference Book)" 
            name="bookTitle" 
            value={formData?.bookTitle || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Section / Part Number (e.g. Part II, Section 4)" 
            name="sectionNumber" 
            value={formData?.sectionNumber || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Section Editors / Authors" 
            name="sectionEditors" 
            value={formData?.sectionEditors || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Publisher Name" 
            name="publisherName" 
            value={formData?.publisherName || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Publication Year" 
            name="publicationYear" 
            value={formData?.publicationYear || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Page Range (e.g. 45-78)" 
            name="pageRange" 
            value={formData?.pageRange || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Section Link / URL" 
            name="sectionLink" 
            value={formData?.sectionLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Indexing Proof Link" 
            name="indexingLink" 
            value={formData?.indexingLink || ""} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
    </SubmissionForm>
  );
};

export default BookSectionForm;
