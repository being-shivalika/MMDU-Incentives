import React from "react";
import { Controller } from "react-hook-form";
import { FormSection } from "./FormSection";
import { TextInput, Select, DatePicker } from "../../../../components/ui/FormControls";
import { LinkVerifier } from "./LinkVerifier";
import { DoiLookupField } from "../fields/DoiLookupField";
import { ScopusLookupField } from "../fields/ScopusLookupField";

export const DynamicFormEngine = ({ schema, control, watch, errors, setValue }) => {
  if (!schema || !schema.sections) return null;

  const formValues = watch();

  const renderField = (field, onChange, value) => {
    const errorMsg = errors[field.name]?.message;

    switch (field.type) {
      case "doi_lookup":
        return (
          <DoiLookupField
            label={field.label}
            required={field.required}
            value={value}
            onChange={onChange}
            error={errorMsg}
            onAutofill={(data) => {
              Object.entries(data).forEach(([k, v]) => {
                setValue(k, v, { shouldValidate: true });
              });
            }}
          />
        );
      case "verification_url":
        return (
          <LinkVerifier
            label={field.label}
            required={field.required}
            value={value}
            onChange={onChange}
            error={errorMsg}
            placeholder={field.placeholder}
          />
        );
      case "scopus_lookup":
        return (
          <ScopusLookupField
            label={field.label}
            required={field.required}
            value={value}
            onChange={onChange}
            error={errorMsg}
          />
        );
      case "dropdown":
        return (
          <Select
            label={field.label}
            required={field.required}
            options={field.options}
            value={value || ""}
            onChange={onChange}
            error={errorMsg}
          />
        );
      case "date":
        return (
          <DatePicker
            label={field.label}
            required={field.required}
            value={value || ""}
            onChange={onChange}
            error={errorMsg}
          />
        );
      case "number":
      case "currency":
        return (
          <TextInput
            type="number"
            label={field.label}
            required={field.required}
            value={value || ""}
            onChange={onChange}
            error={errorMsg}
            placeholder={field.placeholder || "0"}
          />
        );
      default:
        return (
          <TextInput
            label={field.label}
            required={field.required}
            value={value || ""}
            onChange={onChange}
            error={errorMsg}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {schema.sections.map((section) => (
        <FormSection
          key={section.id}
          title={section.title}
          description={section.description}
        >
          {section.fields.map((field) => {
            if (field.dependsOn) {
              const depVal = formValues[field.dependsOn.field];
              const matches = Array.isArray(field.dependsOn.valueIn)
                ? field.dependsOn.valueIn.includes(depVal)
                : depVal === field.dependsOn.value;

              if (!matches) return null;
            }

            return (
              <div
                key={field.name}
                className={`col-span-12 md:col-span-${field.gridSpan || 12}`}
              >
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ field: { onChange, value } }) =>
                    renderField(field, onChange, value)
                  }
                />
              </div>
            );
          })}
        </FormSection>
      ))}
    </div>
  );
};
