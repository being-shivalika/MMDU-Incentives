import React from "react";
import { FileUpload } from "../../../../components/ui/FormControls";

export const UploadField = ({ value, onChange, error, label, required, accept, maxSizeMb }) => {
  return (
    <FileUpload
      label={label}
      required={required}
      error={error}
      value={value || []}
      onChange={onChange}
      multiple={false}
    />
  );
};
