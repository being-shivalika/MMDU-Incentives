// Shared field definitions, validation patterns, and field metadata standards

export const FIELD_TYPES = {
  TEXT: "text",
  TEXTAREA: "textarea",
  NUMBER: "number",
  CURRENCY: "currency",
  DATE: "date",
  DROPDOWN: "dropdown",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  FACULTY_SEARCH: "faculty_search",
  DYNAMIC_TABLE: "dynamic_table",
  DOI_LOOKUP: "doi_lookup",
  SCOPUS_LOOKUP: "scopus_lookup",
  ORCID: "orcid",
  PATENT_NUMBER: "patent_number",
  VERIFICATION_URL: "verification_url",
  FILE_UPLOAD: "file_upload"
};

export const COMMON_VALIDATORS = {
  doi: /^10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+$/,
  orcid: /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/,
  isbn: /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
};
