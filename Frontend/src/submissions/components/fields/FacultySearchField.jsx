import React from "react";
import { SearchableFacultySelector } from "../../../../components/ui/FormControls";

export const FacultySearchField = ({ value, onChange, error, label, required }) => {
  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelectChange = (newVal) => {
    // If it's a single select field, return first element, otherwise return array
    onChange(newVal);
  };

  return (
    <SearchableFacultySelector
      label={label}
      required={required}
      error={error}
      value={safeValue}
      onChange={handleSelectChange}
    />
  );
};
