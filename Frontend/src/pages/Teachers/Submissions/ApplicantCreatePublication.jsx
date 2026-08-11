import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PublicationForm from "../../../components/Forms/PublicationForm";
import { createSubmission, updateSubmission, getSubmissionById } from "../../../services/submissionService";

const ApplicantCreatePublication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draftId");

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
    journalName: "",
    quartile: "Q1",
    impactFactor: "",
    quartileProof: "",
    volumeNo: "",
    issueNo: "",
    pageNo: "",
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
          dropdown: meta.dropdown || "",
          firstVerification: meta.firstVerification || meta.doi || "",
          secondVerification: meta.secondVerification || meta.scopusLink || "",
          thirdVerification: meta.thirdVerification || "",
          fourthVerification: meta.fourthVerification || "",
          authors: meta.authors || [],
          certified: meta.certified || false,
          journalName: meta.journalName || "",
          quartile: meta.quartile || "Q1",
          impactFactor: meta.impactFactor || "",
          quartileProof: meta.quartileProof || "",
          volumeNo: meta.volumeNo || "",
          issueNo: meta.issueNo || "",
          pageNo: meta.pageNo || "",
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
        title: formData.title || formData.journalName || "Untitled Publication",
        typeId: "journal_publication",
        category: "research_publications",
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
      console.error("Failed to submit publication", err);
      alert("Error submitting publication: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    try {
      const payload = {
        title: formData.title || formData.journalName || "Untitled Publication Draft",
        typeId: "journal_publication",
        category: "research_publications",
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
