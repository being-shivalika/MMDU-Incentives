import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookSectionForm from "../../../components/Forms/BookSectionForm";
import { createSubmission } from "../../../services/submissionService";

const ApplicantCreateBookSection = () => {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    dropdown: "",
    firstVerification: "",
    secondVerification: "",
    thirdVerification: "",
    fourthVerification: "",
    authors: [],
    bookTitle: "",
    sectionNumber: "",
    sectionEditors: "",
    publisherName: "",
    publicationYear: "",
    pageRange: "",
    sectionLink: "",
    indexingLink: "",
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
    try {
      await createSubmission({
        title: formData.title || "Untitled Book Section",
        typeId: "book_section",
        subtype: "book_section",
        category: "books_chapters",
        metadata: formData,
        status: "DEPARTMENT_REVIEW"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to submit book section", err);
      alert("Error submitting book section: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    try {
      await createSubmission({
        title: formData.title || "Untitled Book Section Draft",
        typeId: "book_section",
        subtype: "book_section",
        category: "books_chapters",
        metadata: formData,
        status: "DRAFT"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to save book section draft", err);
      alert("Error saving draft: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <BookSectionForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreateBookSection;
