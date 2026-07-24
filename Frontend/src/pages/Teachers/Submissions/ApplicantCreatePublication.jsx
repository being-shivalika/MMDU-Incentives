import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicationForm from "../../../components/Forms/PublicationForm";
import { saveMockSubmission } from "../../../utils/mockBackend";

const ApplicantCreatePublication = () => {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    dropdown: "",
    firstVerification: "",
    secondVerification: "",
    thirdVerification: "",
    fourthVerification: "",
    authors: [],
    certified: false,
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
    console.log("Submitting Publication API...", formData);
    saveMockSubmission(formData, "Publication", "Research");
    navigate("/applicant/submissions");
  };

  const onDraft = () => {
    console.log("Saving Publication Draft API...", formData);
    // TODO: Connect to backend APIs
  };

  return (
    <PublicationForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreatePublication;
