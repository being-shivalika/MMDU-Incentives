import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatentForm from "../../../components/Forms/PatentForm";
import { saveMockSubmission } from "../../../utils/mockBackend";

const ApplicantCreatePatent = () => {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    dropdown: "",
    firstVerification: "",
    secondVerification: "",
    thirdVerification: "",
    fourthVerification: "",
    authors: [],
    inventorDetails: "",
    applicationNumber: "",
    filingDate: "",
    grantDate: "",
    patentCategory: "",
    technologyDomain: "",
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
    console.log("Submitting Patent API...", formData);
    saveMockSubmission(formData, "Patent", "Innovation");
    navigate("/applicant/submissions");
  };

  const onDraft = () => {
    console.log("Saving Patent Draft API...", formData);
    // TODO: Connect to backend APIs
  };

  return (
    <PatentForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreatePatent;
