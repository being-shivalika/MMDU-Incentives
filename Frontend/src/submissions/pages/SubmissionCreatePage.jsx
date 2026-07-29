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
        <div className="space-y-1.5 border-b border-neutral-100 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-neutral-800" />
            New Research & Incentive Submission
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            Select the appropriate category below to initialize a standardized verification workflow.
          </p>
        </div>

        <div className="space-y-8 pt-2">
          {SUBMISSION_CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-4">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.types.map((type) => (
                  <Card
                    key={type.id}
                    onClick={() => setSelectedTypeId(type.id)}
                    className="group p-5 border border-neutral-200 bg-white shadow-sm hover:border-neutral-800 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col text-left justify-between rounded-xl"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-neutral-800 group-hover:text-neutral-800 transition-colors">
                        {type.label}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                    {type.incentiveEligible && (
                      <span className="inline-flex mt-4 self-start text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wide group-hover:bg-neutral-800 group-hover:text-white transition-colors">
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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <span className="text-sm text-neutral-500 font-medium">Resolving schema metadata...</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white border border-neutral-200 rounded-xl shadow-sm space-y-4 my-12 animate-in zoom-in-95 duration-200">
        <div className="inline-flex p-4 bg-green-50 text-green-600 rounded-full border border-green-100 mb-2">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-800">Submission Recorded Successfully</h2>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
          Your research claim has been recorded. The active state has been updated, and department routing has been initialized.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="text-sm font-semibold">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate("/submissions/my")} className="text-sm font-semibold bg-neutral-800 hover:bg-neutral-800 text-white">
            View My Claims
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-150 pb-5">
        <div className="space-y-2">
          <button
            onClick={() => setSelectedTypeId("")}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 font-semibold transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
            {schema?.title || "New Submission"}
          </h1>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Dynamic Schema Version {schema?.version || "1.0"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleSaveDraft}
            disabled={submitting}
            variant="outline"
            className="text-sm flex items-center gap-2 px-4 py-2.5 font-semibold transition-colors bg-white"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(() => {})}
            disabled={submitting}
            className="text-sm flex items-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-800 text-white font-semibold transition-colors"
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
        <form onSubmit={handleSubmit(() => {})} className="space-y-8 pb-10">
          <Card className="p-6 bg-white border border-neutral-200 shadow-sm rounded-xl">
            <DynamicFormEngine
              schema={schema}
              control={control}
              watch={watch}
              errors={errors}
              setValue={setValue}
            />
          </Card>
        </form>
      )}
    </div>
  );
};