import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CopyrightForm from "../../../components/Forms/CopyRightForm";
import { createSubmission } from "../../../services/submissionService";

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

  const onSubmit = async () => {
    console.log("Submitting Claim API...", formData);
    try {
      await createSubmission({
        title: formData.title || "Untitled Copyright",
        typeId: "copyright",
        category: "intellectual_property",
        metadata: formData,
        status: "DEPARTMENT_REVIEW"
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to submit claim", err);
      alert("Error submitting claim: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    console.log("Saving Claim Draft API...", formData);
    try {
      await createSubmission({
        title: formData.title || "Untitled Copyright Draft",
        typeId: "copyright",
        category: "intellectual_property",
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
