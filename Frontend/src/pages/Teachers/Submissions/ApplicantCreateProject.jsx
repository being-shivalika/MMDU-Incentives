import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StartupForm from "../../../components/Forms/StartupForm";
import { createSubmission } from "../../../services/submissionService";

const ApplicantCreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    dropdown: "",
    firstVerification: "",
    secondVerification: "",
    thirdVerification: "",
    fourthVerification: "",
    authors: [],
    founderName: "",
    registrationDate: "",
    startupCategory: "",
    fundingStatus: "",
    incubatorName: "",
    revenueGenerated: "",
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
    console.log("Submitting Project API...", formData);
    try {
      await createSubmission({
        title: formData.title || "Untitled Project",
        typeId: "startup",
        category: "innovation_projects",
        metadata: formData,
        status: "DEPARTMENT_REVIEW"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to submit project", err);
      alert("Error submitting project: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    console.log("Saving Project Draft API...", formData);
    try {
      await createSubmission({
        title: formData.title || "Untitled Project Draft",
        typeId: "startup",
        category: "innovation_projects",
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
    <StartupForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreateProject;
