import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";
import FieldTooltip from "../Ui/FieldTooltip";

const BookChapterForm = ({ 
  formData, 
  handleInputChange, 
  handleAddAuthor, 
  handleRemoveAuthor, 
  onSubmit, 
  onDraft 
}) => {
  return (
    <SubmissionForm
      title="Book Chapter Submission"
      category="Book Chapter"
      basicFields={{
        title: "Chapter Title",
        domain: "Research Domain",
        dropdown: "Indexing Tier",
      }}
      dropdownOptions={[
        "Scopus / Web of Science Indexed",
        "International Publisher (Springer/Elsevier/Wiley)",
        "National Publisher with ISBN",
        "Other Peer-Reviewed Book",
      ]}
      verificationLabels={{
        first: "ISBN Number",
        second: "Scopus / DOI Link",
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
          <span>Book Chapter Specifics</span>
          <FieldTooltip
            text="Book Chapter (National/International Publisher) indexed in Scopus/WoS: ₹8,000 cash incentive per MMDU Policy Table 1."
            policyLink="/policies"
          />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Book Title (Parent Book)" 
            tooltip="Name of parent edited book volume per publisher catalog."
            name="bookTitle" 
            value={formData?.bookTitle || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Chapter Number / ID" 
            tooltip="Official chapter number or identifier."
            name="chapterNumber" 
            value={formData?.chapterNumber || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Book Editors (Name)" 
            tooltip="Names of book volume editors."
            name="bookEditors" 
            value={formData?.bookEditors || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Publisher Name" 
            tooltip="National / International repute publisher (e.g. Springer, Elsevier, Wiley, CRC Press) per Policy Table 1."
            name="publisherName" 
            value={formData?.publisherName || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Publication Year" 
            tooltip="Year of book chapter publication."
            name="publicationYear" 
            value={formData?.publicationYear || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Page Range (e.g. 105-130)" 
            tooltip="Chapter page range in book volume."
            name="pageRange" 
            value={formData?.pageRange || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Chapter DOI / Web Link" 
            tooltip="Official DOI or publisher URL for chapter verification."
            name="chapterLink" 
            value={formData?.chapterLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Indexing / Proof Link" 
            tooltip="Scopus/WoS database indexing link or proof URL per Policy Table 1 & Sec 18."
            name="indexingLink" 
            value={formData?.indexingLink || ""} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
    </SubmissionForm>
  );
};

export default BookChapterForm;
