import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookForm from "../../../components/Forms/BookForm";
import { createSubmission } from "../../../services/submissionService";

const ApplicantCreateBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    dropdown: "",
    firstVerification: "",
    secondVerification: "",
    thirdVerification: "",
    fourthVerification: "",
    authors: [],
    authorEditorName: "",
    publisherName: "",
    publicationYear: "",
    edition: "",
    chapterDetails: "",
    pageCount: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAuthor = (faculty) => {
    setFormData((prev) => {
      if (prev.authors.find((a) => a.id === faculty.id)) return prev;
      return { ...prev, authors: [...prev.authors, faculty] };
    });
  };

  const handleRemoveAuthor = (id) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((a) => a.id !== id),
    }));
  };

  const navigate = useNavigate();

  const onSubmit = async () => {
    console.log("Submitting Book API...", formData);
    try {
      await createSubmission({
        title: formData.title || "Untitled Book",
        typeId: "book",
        category: "books_chapters",
        metadata: formData,
        status: "DEPARTMENT_REVIEW"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to submit book", err);
      alert("Error submitting book: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    console.log("Saving Book Draft API...", formData);
    try {
      await createSubmission({
        title: formData.title || "Untitled Book Draft",
        typeId: "book",
        category: "books_chapters",
        metadata: formData,
        status: "DRAFT"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to save draft", err);
      alert("Error saving draft: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <BookForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreateBook;
