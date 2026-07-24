import React from "react";
import { TextInput } from "../../../../components/ui/FormControls";
import { ShieldAlert } from "lucide-react";

export const PatentField = ({ value, onChange, error, label, required }) => {
  return (
    <div className="w-full">
      <TextInput
        label={label}
        required={required}
        error={error}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., IN-202611092831-A"
      />
    </div>
  );
};
