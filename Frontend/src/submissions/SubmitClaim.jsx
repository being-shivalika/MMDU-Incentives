import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/FormControls";
import { FormEngine, CATEGORY_OPTIONS } from "../../components/forms/FormEngine";
import { createClaim, updateClaim } from "../../services/mockData";
import { ArrowLeft, BookOpen, AlertCircle } from "lucide-react";

export const SubmitClaim = () => {
  const { user, triggerDataRefresh, addNotification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If editing an existing claim or draft
  const claimToEdit = location.state?.claim;
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");
  
  const [category, setCategory] = useState(claimToEdit?.category || categoryParam || "");

  useEffect(() => {
    if (!claimToEdit && categoryParam) {
      setCategory(categoryParam);
    }
  }, [categoryParam, claimToEdit]);

  const handleSubmitClaim = (formData) => {
    const isNew = !claimToEdit?.id;
    const payload = {
      title: formData.title,
      category: category,
      status: "pending_hod",
      creatorId: user.id,
      creatorName: user.name,
      creatorDept: user.department,
      creatorRole: user.role,
      fields: { ...formData }
    };

    let result;
    if (isNew) {
      result = createClaim(payload);
    } else {
      result = updateClaim(claimToEdit.id, {
        title: formData.title,
        status: "pending_hod",
        fields: { ...formData }
      });
    }

    if (result) {
      addNotification(`Research claim "${formData.title}" successfully submitted to Department HOD for review.`, "success");
      triggerDataRefresh();
      navigate("/submissions/my");
    }
  };

  const handleSaveDraft = (formData) => {
    const isNew = !claimToEdit?.id;
    const payload = {
      title: formData.title || "Untitled Draft",
      category: category,
      status: "draft",
      creatorId: user.id,
      creatorName: user.name,
      creatorDept: user.department,
      creatorRole: user.role,
      fields: { ...formData }
    };

    let result;
    if (isNew) {
      result = createClaim(payload);
      addNotification(`Draft claim saved. You can complete it from the Drafts tab.`, "info");
      // Set the claimToEdit to be the newly created draft so future autosaves update it instead of inserting!
      location.state = { claim: result };
    } else {
      result = updateClaim(claimToEdit.id, payload);
      // Silent notification for autosaves
    }

    triggerDataRefresh();
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 h-9 text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <span className="text-xs text-brand-gray-400 font-medium">
          {claimToEdit ? `Modifying: ${claimToEdit.id}` : "Portal Creation Cell"}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{claimToEdit ? "Modify and Resubmit Claim" : "Submit Research Incentive Claim"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Category Selector */}
          {!claimToEdit && (
            <div className="max-w-md">
              <Select
                label="Select Research Claim Category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={CATEGORY_OPTIONS}
                placeholder="Choose a category..."
              />
            </div>
          )}

          {claimToEdit && (
            <div className="bg-brand-gray-50 border border-brand-gray-200 rounded p-3 text-xs flex items-center justify-between">
              <span className="font-semibold text-brand-gray-600">Editing category:</span>
              <span className="uppercase font-bold text-black bg-brand-gray-200 px-2 py-0.5 rounded">
                {CATEGORY_OPTIONS.find(c => c.value === category)?.label}
              </span>
            </div>
          )}

          {category ? (
            <div className="border-t border-brand-gray-150 pt-6">
              <FormEngine
                category={category}
                initialValues={claimToEdit ? { ...claimToEdit.fields, documents: claimToEdit.documents } : null}
                onSubmitClaim={handleSubmitClaim}
                onSaveDraft={handleSaveDraft}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-brand-gray-200 rounded-lg text-center bg-brand-gray-50/50">
              <BookOpen className="h-8 w-8 text-brand-gray-400 mb-2" />
              <h4 className="text-sm font-semibold text-brand-gray-800 m-0">No Category Selected</h4>
              <p className="text-xs text-brand-gray-400 mt-1 max-w-xs">
                Select a research claim category from the dropdown above to load the dynamic wizard form.
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};
