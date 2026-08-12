import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

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
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          Book Specifics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Author / Editor Name" 
            name="authorEditorName" 
            value={formData?.authorEditorName || ""} 
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
            label="Edition" 
            name="edition" 
            value={formData?.edition || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Chapter Details" 
            name="chapterDetails" 
            value={formData?.chapterDetails || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Page Count" 
            name="pageCount" 
            value={formData?.pageCount || ""} 
            onChange={handleInputChange} 
          />
          
          {/* Shifted these here to ensure they render, as SubmissionForm only handles 2 verification links natively */}
          <Input 
            label="Book Link" 
            name="bookLink" 
            value={formData?.bookLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Indexing Link" 
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