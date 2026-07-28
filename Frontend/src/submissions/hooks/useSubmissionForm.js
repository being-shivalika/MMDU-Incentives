import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SchemaRegistry } from "../registry/SchemaRegistry";
import { getSubmissionTypeConfig } from "../config/submissionCategories";
import { submissionsApi } from "../../../services/api/submissions";

export const useSubmissionForm = (typeId, submissionId = null) => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const typeConfig = getSubmissionTypeConfig(typeId);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      coAuthors: [] // Ensure coAuthors array exists by default for the backend
    }
  });

  // 1. ADAPTER: Expose current state as `formData` for the UI forms
  const formData = watch();

  // Load appropriate schema dynamically at runtime
  useEffect(() => {
    if (typeConfig?.schemaKey) {
      const targetSchema = SchemaRegistry.get(typeConfig.schemaKey);
      setSchema(targetSchema);
    }
  }, [typeId, typeConfig?.schemaKey]);

  // Load existing data if editing or resubmitting
  useEffect(() => {
    if (submissionId) {
      setLoading(true);
      submissionsApi.getById(submissionId)
        .then((data) => {
          if (data && data.metadata) {
            reset(data.metadata);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [submissionId, reset]);

  // 2. ADAPTER: Create a standard onChange handler for our custom Input components
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === "checkbox" ? checked : value, { 
      shouldDirty: true, 
      shouldValidate: true 
    });
  };

  // 3. ADAPTER: Create array mutators for the coAuthors list
  const handleAddAuthor = (newAuthor) => {
    const currentAuthors = watch("coAuthors") || [];
    setValue("coAuthors", [...currentAuthors, newAuthor], { shouldDirty: true });
  };

  const handleRemoveAuthor = (authorId) => {
    const currentAuthors = watch("coAuthors") || [];
    setValue(
      "coAuthors",
      currentAuthors.filter((a) => a.id !== authorId),
      { shouldDirty: true }
    );
  };

  const submitForm = async (data, isDraft = false) => {
    setSubmitting(true);
    setSuccess(false);
    
    try {
      // 4. PAYLOAD FIX: Inject category and subtype for the backend Policy Engine
      const payload = {
        typeId,
        category: typeConfig?.category || "", // e.g., 'research_publications'
        subtype: typeConfig?.subtype || "",   // e.g., 'journal'
        metadata: data,                       // includes title, domain, coAuthors, etc.
        status: isDraft ? "DRAFT" : "DEPARTMENT_REVIEW"
      };

      if (submissionId) {
        await submissionsApi.update(submissionId, payload);
      } else {
        await submissionsApi.create(payload);
      }
      setSuccess(true);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    schema,
    loading,
    submitting,
    success,
    errors,
    
    // UI Form Adapters
    formData,
    handleInputChange,
    handleAddAuthor,
    handleRemoveAuthor,
    
    // Submit Handlers
    onSubmit: handleSubmit((data) => submitForm(data, false)),
    onDraft: handleSubmit((data) => submitForm(data, true))
  };
};