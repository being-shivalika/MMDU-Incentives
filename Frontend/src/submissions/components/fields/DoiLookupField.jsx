import React, { useState } from "react";
import { Search, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { TextInput } from "../../../../components/ui/FormControls";
import { Button } from "../../../../components/ui/Button";

export const DoiLookupField = ({ value, onChange, error, label, required, onAutofill }) => {
  const [doiText, setDoiText] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const triggerLookup = async () => {
    if (!doiText) return;
    setLoading(true);
    setStatus(null);

    // Mock DOI resolver fetch
    setTimeout(() => {
      setLoading(false);
      if (doiText.includes("10.1109") || doiText.includes("10.1016") || doiText.includes("10.1007")) {
        setStatus("success");
        onChange(doiText);

        // Notify parent form to autofill other fields
        if (onAutofill) {
          onAutofill({
            title: "Distributed Consensus Algorithms in Edge Computing Networks",
            journalName: "IEEE Transactions on Parallel and Distributed Systems",
            publisher: "IEEE Computer Society",
            issn: "1045-9219",
            publicationDate: "2025-06-15",
            indexedIn: "Scopus & SCI/SCIE",
            quartile: "Q1"
          });
        }
      } else {
        setStatus("error");
      }
    }, 1200);
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <TextInput
            label={label}
            required={required}
            error={error}
            value={doiText}
            onChange={(e) => {
              setDoiText(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="e.g., 10.1109/TPDS.2025.123456"
          />
        </div>
        <Button
          type="button"
          onClick={triggerLookup}
          disabled={loading || !doiText}
          className="h-10 shrink-0 flex items-center gap-1.5 px-3"
          variant="outline"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-gray-500" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Autofill
        </Button>
      </div>

      {status === "success" && (
        <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          DOI verified. Metadata auto-filled successfully.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Invalid or unverified DOI format. Please check and try again.
        </p>
      )}
    </div>
  );
};
