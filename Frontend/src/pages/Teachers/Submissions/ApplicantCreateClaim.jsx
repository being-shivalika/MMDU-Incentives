import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CopyrightForm from "../../../components/Forms/CopyRightForm";
import { saveMockSubmission } from "../../../utils/mockBackend";

const ApplicantCreateClaim = () => {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    dropdown: "",
    firstVerification: "",
    secondVerification: "",
    thirdVerification: "",
    fourthVerification: "",
    authors: [],
    authorCreatorName: "",
    registrationDate: "",
    applicationNumber: "",
    copyrightCategory: "",
    creationDescription: "",
    usageDetails: "",
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
    console.log("Submitting Claim API...", formData);
    saveMockSubmission(formData, "Copyright", "Claim");
    navigate("/applicant/submissions");
  };

  const onDraft = () => {
    console.log("Saving Claim Draft API...", formData);
    // TODO: Connect to backend APIs
  };

  return (
    <CopyrightForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreateClaim;
