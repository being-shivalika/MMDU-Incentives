import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StartupForm from "../../../components/Forms/StartupForm";
import { saveMockSubmission } from "../../../utils/mockBackend";

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

  const onSubmit = () => {
    console.log("Submitting Project API...", formData);
    saveMockSubmission(formData, "Startup", "Project");
    navigate("/applicant/submissions");
  };

  const onDraft = () => {
    console.log("Saving Project Draft API...", formData);
    // TODO: Connect to backend APIs
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
