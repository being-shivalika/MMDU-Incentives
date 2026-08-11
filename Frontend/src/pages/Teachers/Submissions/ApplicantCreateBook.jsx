import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookForm from "../../../components/Forms/BookForm";
import { createSubmission, updateSubmission, getSubmissionById } from "../../../services/submissionService";

const ApplicantCreateBook = () => {
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
    authorEditorName: "",
    publisherName: "",
    publicationYear: "",
    edition: "",
    chapterDetails: "",
    pageCount: "",
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
          authorEditorName: meta.authorEditorName || "",
          publisherName: meta.publisherName || "",
          publicationYear: meta.publicationYear || "",
          edition: meta.edition || "",
          chapterDetails: meta.chapterDetails || "",
          pageCount: meta.pageCount || "",
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
        title: formData.title || "Untitled Book",
        typeId: "book",
        category: "books_chapters",
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
      console.error("Failed to submit book", err);
      alert("Error submitting book: " + (err.response?.data?.message || err.message));
    }
  };

  const onDraft = async () => {
    try {
      const payload = {
        title: formData.title || "Untitled Book Draft",
        typeId: "book",
        category: "books_chapters",
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
    <BookForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    />
  );
};

export default ApplicantCreateBook;
