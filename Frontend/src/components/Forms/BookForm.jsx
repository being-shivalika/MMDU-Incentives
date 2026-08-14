import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";
import FieldTooltip from "../Ui/FieldTooltip";

const BookForm = ({ 
  formData, 
  handleInputChange, 
  handleAddAuthor, 
  handleRemoveAuthor, 
  onSubmit, 
  onDraft 
}) => {
  return (
    <SubmissionForm
      title="Books & Book Chapters Submission"
      category="Books & Chapters"
      basicFields={{
        title: "Title (Chapter / Book)",
        domain: "Domain / Discipline",
        dropdown: "Publication Type",
      }}
      dropdownOptions={[
        "Book Chapter",
        "Books (ISBN) only as author",
        "Edited Book",
        "Reference Book",
      ]}
      verificationLabels={{
        first: "ISBN",
        second: "Publisher Website",
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
          <span>Book Specifics</span>
          <FieldTooltip
            text="Books (ISBN) only as author (not edited books): ₹15,000 cash incentive per MMDU Research Promotion Policy Table 1."
            policyLink="/policies"
          />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Author / Editor Name" 
            tooltip="Name of author(s) per title page. Edited books are excluded from the ₹15,000 authored book incentive per Policy Table 1."
            name="authorEditorName" 
            value={formData?.authorEditorName || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Publisher Name" 
            tooltip="Reputed National / International publisher."
            name="publisherName" 
            value={formData?.publisherName || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Publication Year" 
            tooltip="Year of book publication."
            name="publicationYear" 
            value={formData?.publicationYear || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Edition" 
            tooltip="Edition number (e.g. 1st Edition, 2nd Revised Edition)."
            name="edition" 
            value={formData?.edition || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Chapter Details" 
            tooltip="Chapter titles or volume specifications."
            name="chapterDetails" 
            value={formData?.chapterDetails || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Page Count" 
            tooltip="Total page count of book volume."
            name="pageCount" 
            value={formData?.pageCount || ""} 
            onChange={handleInputChange} 
          />
          
          <Input 
            label="Book Link" 
            tooltip="Official publisher web page or purchase URL for book verification."
            name="bookLink" 
            value={formData?.bookLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Indexing Link" 
            tooltip="Indexing proof link or ISBN directory entry per Policy Table 1 & Sec 18."
            name="indexingLink" 
            value={formData?.indexingLink || ""} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
    </SubmissionForm>
  );
};

export default BookForm;