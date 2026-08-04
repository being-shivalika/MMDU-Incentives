import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookChapterForm from "../../../components/Forms/BookChapterForm";
import { createSubmission } from "../../../services/submissionService";

const ApplicantCreateBookChapter = () => {
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
    chapterNumber: "",
    bookEditors: "",
    publisherName: "",
    publicationYear: "",
    pageRange: "",
    chapterLink: "",
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
        title: formData.title || "Untitled Book Chapter",
        typeId: "book_chapter",
        subtype: "book_chapter",
        category: "books_chapters",
        metadata: formData,
        status: "DEPARTMENT_REVIEW"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to submit book chapter", err);
      alert("Error submitting book chapter: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    try {
      await createSubmission({
        title: formData.title || "Untitled Book Chapter Draft",
        typeId: "book_chapter",
        subtype: "book_chapter",
        category: "books_chapters",
        metadata: formData,
        status: "DRAFT"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to save book chapter draft", err);
      alert("Error saving draft: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <BookChapterForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreateBookChapter;
