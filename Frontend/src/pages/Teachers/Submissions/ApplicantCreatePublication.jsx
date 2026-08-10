import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicationForm from "../../../components/Forms/PublicationForm";
import { createSubmission } from "../../../services/submissionService";

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
    quartile: "Q1",
    impactFactor: "",
    quartileProof: "",
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
    console.log("Submitting Publication API...", formData);
    try {
      await createSubmission({
        title: formData.title || "Untitled Publication",
        typeId: "journal_publication", // Map to a recognized typeId
        category: "research_publications",
        metadata: formData,
        status: "DEPARTMENT_REVIEW"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to submit publication", err);
      alert("Error submitting publication: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    console.log("Saving Publication Draft API...", formData);
    try {
      await createSubmission({
        title: formData.title || "Untitled Publication Draft",
        typeId: "journal_publication",
        category: "research_publications",
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
