import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

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
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          Book Chapter Specifics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Book Title (Parent Book)" 
            name="bookTitle" 
            value={formData?.bookTitle || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Chapter Number / ID" 
            name="chapterNumber" 
            value={formData?.chapterNumber || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Book Editors (Name)" 
            name="bookEditors" 
            value={formData?.bookEditors || ""} 
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
            label="Page Range (e.g. 105-130)" 
            name="pageRange" 
            value={formData?.pageRange || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Chapter DOI / Web Link" 
            name="chapterLink" 
            value={formData?.chapterLink || ""} 
            onChange={handleInputChange} 
          />
          <Input 
            label="Indexing / Proof Link" 
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
