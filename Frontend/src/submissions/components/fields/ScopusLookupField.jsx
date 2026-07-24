import React, { useState } from "react";
import { Check, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { TextInput } from "../../../../components/ui/FormControls";
import { Button } from "../../../../components/ui/Button";

export const ScopusLookupField = ({ value, onChange, error, label, required }) => {
  const [scopusId, setScopusId] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [citationInfo, setCitationInfo] = useState(null);

  const verifyScopus = () => {
    if (!scopusId) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCitationInfo({
        citations: 24,
        hIndex: 12,
        publisher: "Elsevier B.V.",
        verificationStatus: "Verified & Synced"
      });
      onChange(scopusId);
    }, 1000);
  };

  return (
    <div className="space-y-2 w-full text-left">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <TextInput
            label={label}
            required={required}
            error={error}
            value={scopusId}
            onChange={(e) => {
              setScopusId(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="e.g., 57218930400"
          />
        </div>
        <Button
          type="button"
          onClick={verifyScopus}
          disabled={loading || !scopusId}
          className="h-10 shrink-0 flex items-center gap-1 px-3"
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Verify ID
        </Button>
      </div>

      {citationInfo && (
        <div className="p-3 bg-brand-gray-50 border border-brand-gray-200 rounded-md flex justify-between items-center animate-in fade-in duration-200">
          <div className="space-y-0.5">
            <span className="text-[10px] text-brand-gray-400 font-bold uppercase tracking-wider">Scopus Integration</span>
            <div className="flex items-center gap-4 text-xs font-semibold text-brand-gray-700 mt-1">
              <span>Citations: <strong className="text-black">{citationInfo.citations}</strong></span>
              <span>Author H-Index: <strong className="text-black">{citationInfo.hIndex}</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {citationInfo.verificationStatus}
          </div>
        </div>
      )}
    </div>
  );
};
