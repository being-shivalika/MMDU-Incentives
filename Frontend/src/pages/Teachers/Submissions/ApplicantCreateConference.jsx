import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConferenceForm from "../../../components/Forms/ConferenceForm";
import { createSubmission } from "../../../services/submissionService";

const ApplicantCreateConference = () => {
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    dropdown: "Conference",
    firstVerification: "",
    secondVerification: "",
    thirdVerification: "",
    fourthVerification: "",
    conferenceTitle: "",
    conferenceLevel: "International",
    presentationStatus: "Presented",
    authorType: "Faculty",
    indexingTier: "IEEE / ACM / Scopus Indexed",
    organizedBy: "",
    startDate: "",
    endDate: "",
    venue: "",
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

  const onSubmit = async () => {
    try {
      await createSubmission({
        title: formData.title || formData.conferenceTitle || "Untitled Conference Claim",
        typeId: "conference_publication",
        category: "conferences",
        subtype: "conference",
        metadata: formData,
        status: "DEPARTMENT_REVIEW",
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to submit conference claim", err);
      alert("Error submitting conference claim: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    try {
      await createSubmission({
        title: formData.title || formData.conferenceTitle || "Untitled Conference Draft",
        typeId: "conference_publication",
        category: "conferences",
        subtype: "conference",
        metadata: formData,
        status: "DRAFT",
      });
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to save draft", err);
      alert("Error saving draft: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <ConferenceForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreateConference;
