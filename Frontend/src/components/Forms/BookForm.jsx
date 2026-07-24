import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const BookForm = ({ formData, handleInputChange, handleAddAuthor, handleRemoveAuthor, onSubmit, onDraft }) => {
  return (
    <SubmissionForm
      title="Book Submission"
      category="Book"
      basicFields={{
        title: "Book Title",
        domain: "Book Domain",
        dropdown: "Book Type",
      }}
      dropdownOptions={[
        "Authored Book",
        "Edited Book",
        "Book Chapter",
        "Reference Book",
      ]}
      verificationLabels={{
        first: "ISBN",
        second: "Publisher Website",
        third: "Book Link",
        fourth: "Indexing Link",
      }}
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    >
      {/* Book Specific Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Author / Editor Name" name="authorEditorName" value={formData?.authorEditorName || ""} onChange={handleInputChange} />
        <Input label="Publisher Name" name="publisherName" value={formData?.publisherName || ""} onChange={handleInputChange} />
        <Input label="Publication Year" name="publicationYear" value={formData?.publicationYear || ""} onChange={handleInputChange} />
        <Input label="Edition" name="edition" value={formData?.edition || ""} onChange={handleInputChange} />
        <Input label="Chapter Details" name="chapterDetails" value={formData?.chapterDetails || ""} onChange={handleInputChange} />
        <Input label="Page Count" name="pageCount" value={formData?.pageCount || ""} onChange={handleInputChange} />
      </div>
    </SubmissionForm>
  );
};

export default BookForm;
