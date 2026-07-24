import React from "react";
import { ExternalLink, Link2 } from "lucide-react";
import { TextInput } from "../../../../components/ui/FormControls";

export const VerificationUrlField = ({ value, onChange, error, label, required }) => {
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const showLink = value && isValidUrl(value);

  return (
    <div className="relative w-full text-left">
      <TextInput
        label={label}
        required={required}
        error={error}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
      />
      {showLink && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-3 top-[34px] flex items-center gap-1 text-xs text-brand-blue-500 hover:text-black font-semibold transition-colors"
        >
          <Link2 className="h-3.5 w-3.5" />
          Test Link
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};
