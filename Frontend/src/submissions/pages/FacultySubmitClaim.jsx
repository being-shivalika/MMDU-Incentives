import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSubmissionForm } from "../hooks/useSubmissionForm";
import { DynamicFormEngine } from "../components/form/DynamicFormEngine";
import { AuthorSelector } from "../components/form/AuthorSelector";
import { CLAIM_CATEGORIES, getClaimTypeConfig } from "../config/claimCategories";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Save, Send, ArrowLeft, Loader2, Sparkles, BookOpen } from "lucide-react";
import { Controller } from "react-hook-form";

export const FacultySubmitClaim = () => {
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

  // If subtype parameter is not selected, display Category cards
  if (!selectedTypeId) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 text-left">
        <div className="space-y-1.5 border-b border-brand-gray-150 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-brand-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-blue-500" />
            Submit New Research Incentive Claim
          </h1>
          <p className="text-sm text-brand-gray-500 font-medium">
            Select one of the authorized research incentive claims below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {CLAIM_CATEGORIES.map((cat) => (
            <Card
              key={cat.id}
              className="group p-6 border border-brand-gray-200 bg-white shadow-sm hover:border-black hover:shadow-md transition-all duration-200 flex flex-col justify-between rounded-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center bg-brand-gray-50 border border-brand-gray-200 rounded-lg text-brand-gray-800 font-bold group-hover:bg-black group-hover:text-white transition-colors">
                    {cat.title[0]}
                  </span>
                  <h3 className="text-lg font-bold text-brand-gray-900">{cat.title}</h3>
                </div>
                <p className="text-sm text-brand-gray-500 leading-relaxed">{cat.description}</p>
              </div>

              {/* Subtypes selection list */}
              <div className="mt-5 pt-5 border-t border-brand-gray-100 space-y-3">
                <span className="text-[11px] text-brand-gray-400 font-bold uppercase tracking-wider block">
                  Select Claim Subtype
                </span>
                <div className="flex flex-wrap gap-2">
                  {cat.subtypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedTypeId(type.id)}
                      className="px-3 py-1.5 bg-brand-gray-50 hover:bg-black hover:text-white border border-brand-gray-200 text-xs font-semibold text-brand-gray-700 rounded-md transition-colors cursor-pointer"
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gray-400" />
        <span className="text-sm text-brand-gray-500 font-medium">Resolving metadata schema...</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white border border-brand-gray-200 rounded-xl shadow-sm space-y-4 my-12 animate-in zoom-in-95 duration-200">
        <div className="inline-flex p-4 bg-green-50 text-green-600 rounded-full border border-green-100 mb-2">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-brand-gray-900">Claim Submitted to Department Desk</h2>
        <p className="text-sm text-brand-gray-500 max-w-sm mx-auto leading-relaxed">
          Your research claim file has been logged and routed to the Department HOD Desk for review.
        </p>
        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="text-sm font-semibold">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate("/submissions/my")} className="text-sm font-semibold bg-black hover:bg-brand-gray-900 text-white">
            View My Claims Ledger
          </Button>
        </div>
      </div>
    );
  }

  const claimConfig = getClaimTypeConfig(selectedTypeId);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 text-left">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-gray-150 pb-5">
        <div className="space-y-2">
          <button
            onClick={() => setSelectedTypeId("")}
            className="flex items-center gap-1.5 text-xs text-brand-gray-500 hover:text-black font-semibold transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Claim Selection
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-brand-gray-100 text-brand-gray-600 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {claimConfig?.categoryTitle}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-gray-900">{schema?.title || "New Claim File"}</h1>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleSaveDraft}
            disabled={submitting}
            variant="outline"
            className="text-sm flex items-center gap-2 px-4 py-2.5 font-semibold transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(() => {})}
            disabled={submitting}
            className="text-sm flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-brand-gray-900 text-white font-semibold transition-colors"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit Claim File
          </Button>
        </div>
      </div>

      {schema && (
        <form onSubmit={handleSubmit(() => {})} className="space-y-8 pb-10">
          {/* Dynamic Form Engine for fields */}
          <Card className="p-6 bg-white border border-brand-gray-200 shadow-sm rounded-xl">
            <DynamicFormEngine
              schema={schema}
              control={control}
              watch={watch}
              errors={errors}
              setValue={setValue}
            />
          </Card>

          {/* Core Author Selection (Enforced directory select) mapped to coAuthors */}
          <Card className="p-6 bg-white border border-brand-gray-200 shadow-sm rounded-xl">
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-brand-gray-500">
                Author Details
              </h2>
            </div>
            <Controller
              name="coAuthors" // Updated to match backend PolicyRule engine requirements
              control={control}
              rules={{ required: "Co-authors details must be assigned." }}
              render={({ field: { onChange, value } }) => (
                <AuthorSelector
                  value={value || {}}
                  onChange={onChange}
                  error={errors.coAuthors?.message}
                />
              )}
            />
          </Card>
        </form>
      )}
    </div>
  );
};