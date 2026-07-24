import React from "react";
import SubmissionForm from "./SubmissionForm";
import Input from "../Ui/Input";

const BookForm = () => {
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
    >
      {/* Book Specific Fields */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Author / Editor Name" />

        <Input label="Publisher Name" />

        <Input label="Publication Year" />

        <Input label="Edition" />

        <Input label="Chapter Details" />

        <Input label="Page Count" />
      </div>
    </SubmissionForm>
  );
};

export default BookForm;
