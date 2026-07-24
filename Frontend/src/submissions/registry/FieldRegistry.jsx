import React from "react";
import { TextInput, Select, DatePicker } from "../../../components/ui/FormControls";
import { FacultySearchField } from "../components/fields/FacultySearchField";
import { DoiLookupField } from "../components/fields/DoiLookupField";
import { ScopusLookupField } from "../components/fields/ScopusLookupField";
import { OrcidField } from "../components/fields/OrcidField";
import { PatentField } from "../components/fields/PatentField";
import { VerificationUrlField } from "../components/fields/VerificationUrlField";
import { UploadField } from "../components/fields/UploadField";
import { DynamicTable } from "../components/form/DynamicTable";

const registry = {
  text: (props) => <TextInput {...props} />,
  textarea: (props) => <TextInput {...props} type="textarea" />, // Or standard textarea
  number: (props) => <TextInput {...props} type="number" />,
  currency: (props) => <TextInput {...props} type="number" placeholder="Amount in INR" />,
  date: (props) => <DatePicker {...props} />,
  dropdown: ({ options, ...props }) => <Select {...props} options={options} />,
  faculty_search: (props) => <FacultySearchField {...props} />,
  doi_lookup: (props) => <DoiLookupField {...props} />,
  scopus_lookup: (props) => <ScopusLookupField {...props} />,
  orcid: (props) => <OrcidField {...props} />,
  patent_number: (props) => <PatentField {...props} />,
  verification_url: (props) => <VerificationUrlField {...props} />,
  file_upload: (props) => <UploadField {...props} />,
  dynamic_table: (props) => <DynamicTable {...props} />
};

export const FieldRegistry = {
  get: (type) => {
    return registry[type] || registry["text"];
  },
  register: (type, componentFn) => {
    registry[type] = componentFn;
  }
};
