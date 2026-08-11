import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConferenceForm from "../../../components/Forms/ConferenceForm";
import { createSubmission, updateSubmission, getSubmissionById } from "../../../services/submissionService";

const ApplicantCreateConference = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");

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

  useEffect(() => {
    if (!draftId) return;
    const loadDraft = async () => {
      try {
        const res = await getSubmissionById(draftId);
        const claim = res.data || res.claim || res;
        const meta = claim.metadata || {};
        setFormData({
          title: claim.title || meta.title || "",
          domain: meta.domain || meta.researchArea || "",
          dropdown: meta.dropdown || "Conference",
          firstVerification: meta.firstVerification || meta.doi || "",
          secondVerification: meta.secondVerification || meta.scopusLink || "",
          thirdVerification: meta.thirdVerification || "",
          fourthVerification: meta.fourthVerification || "",
          conferenceTitle: meta.conferenceTitle || "",
          conferenceLevel: meta.conferenceLevel || "International",
          presentationStatus: meta.presentationStatus || "Presented",
          authorType: meta.authorType || "Faculty",
          indexingTier: meta.indexingTier || "IEEE / ACM / Scopus Indexed",
          organizedBy: meta.organizedBy || "",
          startDate: meta.startDate || "",
          endDate: meta.endDate || "",
          venue: meta.venue || "",
          authors: meta.authors || [],
          certified: meta.certified || false,
        });
      } catch (err) {
        console.error("Failed to load draft:", err);
      }
    };
    loadDraft();
  }, [draftId]);

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

  const onSubmit = async () => {
    try {
      const payload = {
        title: formData.title || formData.conferenceTitle || "Untitled Conference Claim",
        typeId: "conference_publication",
        category: "conferences",
        subtype: "conference",
        metadata: formData,
        status: "DEPARTMENT_REVIEW",
      };

      if (draftId) {
        await updateSubmission(draftId, payload);
      } else {
        await createSubmission(payload);
      }
      navigate("/applicant/submissions");
    } catch (err) {
      console.error("Failed to submit conference claim", err);
      alert("Error submitting conference claim: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    try {
      const payload = {
        title: formData.title || formData.conferenceTitle || "Untitled Conference Draft",
        typeId: "conference_publication",
        category: "conferences",
        subtype: "conference",
        metadata: formData,
        status: "DRAFT",
      };

      if (draftId) {
        await updateSubmission(draftId, payload);
      } else {
        await createSubmission(payload);
      }
      navigate("/applicant/drafts");
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
