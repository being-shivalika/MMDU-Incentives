import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSubmissionForm } from "../hooks/useSubmissionForm";
import { DynamicFormEngine } from "../components/form/DynamicFormEngine";
import { SUBMISSION_CATEGORIES } from "../config/submissionCategories";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Save, Send, ArrowLeft, Loader2, Sparkles, BookOpen } from "lucide-react";

export const SubmissionCreatePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeId = searchParams.get("type");
  const submissionId = searchParams.get("id");

  const [selectedTypeId, setSelectedTypeId] = useState(typeId || "");

  const {
    schema,
    control,
    watch,
    setValue,
    errors,
    loading,
    submitting,
    success,
    handleSubmit,
    handleSaveDraft
  } = useSubmissionForm(selectedTypeId, submissionId);

  // If type parameter is not present, render Category Selection Grid
  if (!selectedTypeId) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 text-left">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-brand-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-blue-500" />
            New Research & Incentive Submission
          </h1>
          <p className="text-sm text-brand-gray-400">
            Select the appropriate category below to initialize a standardized verification workflow.
          </p>
        </div>

        <div className="space-y-8">
          {SUBMISSION_CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-3">
              <h2 className="text-sm font-bold text-brand-gray-500 uppercase tracking-wider">
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.types.map((type) => (
                  <Card
                    key={type.id}
                    onClick={() => setSelectedTypeId(type.id)}
                    className="p-5 border border-brand-gray-200/80 bg-white/40 backdrop-blur-sm shadow-sm hover:border-black hover:shadow-md cursor-pointer transition-all flex flex-col text-left justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-brand-gray-900">{type.label}</h3>
                      <p className="text-xs text-brand-gray-400 mt-1">{type.description}</p>
                    </div>
                    {type.incentiveEligible && (
                      <span className="inline-flex mt-3 self-start text-[10px] bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full font-bold">
                        Incentive Eligible
                      </span>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gray-400" />
        <span className="text-xs text-brand-gray-400 font-medium">Resolving schema metadata...</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white border border-brand-gray-200 rounded-md shadow-sm space-y-4 my-12">
        <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full border border-green-200">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-brand-gray-900">Submission Recorded Successfully</h2>
        <p className="text-xs text-brand-gray-500 max-w-sm mx-auto">
          Your research claim has been recorded. The active state has been updated, and department routing has been initialized.
        </p>
        <div className="pt-4 flex justify-center gap-2">
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="text-xs">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate("/submissions/my")} className="text-xs">
            View My Claims
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-gray-100 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => setSelectedTypeId("")}
            className="flex items-center gap-1 text-xs text-brand-gray-400 hover:text-black font-semibold transition-colors mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Categories
          </button>
          <h1 className="text-xl font-bold text-brand-gray-900">
            {schema?.title || "New Submission"}
          </h1>
          <p className="text-xs text-brand-gray-400">
            Dynamic schema version {schema?.version || "1.0"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSaveDraft}
            disabled={submitting}
            variant="outline"
            className="text-xs flex items-center gap-1.5 px-3 py-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(() => {})}
            disabled={submitting}
            className="text-xs flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-brand-gray-800"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit Claim
          </Button>
        </div>
      </div>

      {/* Dynamic Form Engine */}
      {schema && (
        <form onSubmit={handleSubmit(() => {})} className="space-y-6">
          <DynamicFormEngine
            schema={schema}
            control={control}
            watch={watch}
            errors={errors}
            setValue={setValue}
          />
        </form>
      )}
    </div>
  );
};
