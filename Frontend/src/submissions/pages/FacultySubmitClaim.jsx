import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSubmissionForm } from "../hooks/useSubmissionForm";
import { DynamicFormEngine } from "../components/form/DynamicFormEngine";
import { AuthorSelector } from "../components/form/AuthorSelector";
import { CLAIM_CATEGORIES, getClaimTypeConfig } from "../config/claimCategories";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Save, Send, ArrowLeft, Loader2, Sparkles, BookOpen, Layers } from "lucide-react";
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
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-brand-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-blue-500" />
            Submit New Research Incentive Claim
          </h1>
          <p className="text-sm text-brand-gray-400">
            Select one of the exactly four authorized research incentive claims below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {CLAIM_CATEGORIES.map((cat) => (
            <Card
              key={cat.id}
              className="p-6 border border-brand-gray-250 bg-white shadow-sm hover:border-black hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-brand-gray-50 border border-brand-gray-200 rounded text-brand-gray-700 font-bold">
                    {cat.title[0]}
                  </span>
                  <h3 className="text-base font-bold text-brand-gray-900">{cat.title}</h3>
                </div>
                <p className="text-xs text-brand-gray-500 leading-relaxed">{cat.description}</p>
              </div>

              {/* Subtypes selection list */}
              <div className="mt-4 pt-4 border-t border-brand-gray-150 space-y-2">
                <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider block">
                  Select Claim Subtype:
                </span>
                <div className="flex flex-wrap gap-2">
                  {cat.subtypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedTypeId(type.id)}
                      className="px-2.5 py-1.5 bg-brand-gray-50 hover:bg-black hover:text-white border border-brand-gray-200 text-xs font-semibold rounded transition-all cursor-pointer"
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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gray-400" />
        <span className="text-xs text-brand-gray-400 font-medium">Resolving metadata schema...</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-white border border-brand-gray-250 rounded-md shadow-sm space-y-4 my-12 animate-in zoom-in-95 duration-200">
        <div className="inline-flex p-3.5 bg-green-50 text-green-600 rounded-full border border-green-200">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-brand-gray-900">Claim Submitted to Department Desk</h2>
        <p className="text-xs text-brand-gray-500 max-w-sm mx-auto">
          Your research claim file has been logged and routed to the Department HOD Desk for review.
        </p>
        <div className="pt-4 flex justify-center gap-2">
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="text-xs">
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate("/submissions/my")} className="text-xs bg-black hover:bg-brand-gray-800">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-gray-150 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => setSelectedTypeId("")}
            className="flex items-center gap-1 text-xs text-brand-gray-400 hover:text-black font-semibold transition-colors mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Claim Selection
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-brand-gray-100 text-brand-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">
              {claimConfig?.categoryTitle}
            </span>
          </div>
          <h1 className="text-xl font-bold text-brand-gray-900">{schema?.title || "New Claim File"}</h1>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSaveDraft}
            disabled={submitting}
            variant="outline"
            className="text-xs flex items-center gap-1.5 px-3.5 py-2 font-bold"
          >
            <Save className="h-4 w-4" />
            Save Claim Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(() => {})}
            disabled={submitting}
            className="text-xs flex items-center gap-1.5 px-3.5 py-2 bg-black hover:bg-brand-gray-800 text-white font-bold"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin animate-spin-fast" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit Claim File
          </Button>
        </div>
      </div>

      {schema && (
        <form onSubmit={handleSubmit(() => {})} className="space-y-6">
          {/* Dynamic Form Engine for fields */}
          <DynamicFormEngine
            schema={schema}
            control={control}
            watch={watch}
            errors={errors}
            setValue={setValue}
          />

          {/* Core Author Selection (Enforced directory select) */}
          <Controller
            name="authors"
            control={control}
            rules={{ required: "Authors details must be assigned." }}
            render={({ field: { onChange, value } }) => (
              <AuthorSelector
                value={value || {}}
                onChange={onChange}
                error={errors.authors?.message}
              />
            )}
          />
        </form>
      )}
    </div>
  );
};
