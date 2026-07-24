import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookForm from "../../../components/Forms/BookForm";
import { saveMockSubmission } from "../../../utils/mockBackend";

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

  const onSubmit = () => {
    console.log("Submitting Book API...", formData);
    saveMockSubmission(formData, "Book", "Publication");
    navigate("/applicant/submissions");
  };

  const onDraft = () => {
    console.log("Saving Book Draft API...", formData);
    // TODO: Connect to backend APIs
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
