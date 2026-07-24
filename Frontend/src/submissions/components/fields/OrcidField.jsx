import React from "react";
import { TextInput } from "../../../../components/ui/FormControls";
import { Check } from "lucide-react";

export const OrcidField = ({ value, onChange, error, label, required }) => {
  const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
  const isValid = value && orcidRegex.test(value);

  return (
    <div className="relative w-full">
      <TextInput
        label={label}
        required={required}
        error={error}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., 0000-0002-1825-0097"
      />
      {isValid && (
        <span className="absolute right-3 top-[34px] flex items-center justify-center bg-green-50 text-green-600 rounded-full p-0.5 border border-green-200">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
};
