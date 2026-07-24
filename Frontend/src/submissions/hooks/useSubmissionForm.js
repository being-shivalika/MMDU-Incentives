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
    defaultValues: {}
  });

  // Load appropriate schema dynamically at runtime
  useEffect(() => {
    if (typeConfig?.schemaKey) {
      const targetSchema = SchemaRegistry.get(typeConfig.schemaKey);
      setSchema(targetSchema);
    }
  }, [typeId]);

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

  const submitForm = async (data, isDraft = false) => {
    setSubmitting(true);
    setSuccess(false);
    try {
      if (submissionId) {
        await submissionsApi.update(submissionId, {
          typeId,
          metadata: data,
          status: isDraft ? "DRAFT" : "DEPARTMENT_REVIEW"
        });
      } else {
        await submissionsApi.create({
          typeId,
          metadata: data,
          status: isDraft ? "DRAFT" : "DEPARTMENT_REVIEW"
        });
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    schema,
    control,
    watch,
    setValue,
    errors,
    loading,
    submitting,
    success,
    handleSubmit: (onValid) => handleSubmit((data) => submitForm(data, false)),
    handleSaveDraft: () => handleSubmit((data) => submitForm(data, true))()
  };
};
