import React, { useState } from "react";

import Card from "../Ui/Card";
import Badge from "../Ui/Badge";
import Input from "../Ui/Input";
import Button from "../Ui/Button";

const departments = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
];

const dummyFaculty = [
  {
    id: "EMP101",
    name: "Dr. Anjali Sharma",
    department: "Computer Science & Engineering",
    designation: "Professor",
  },
  {
    id: "EMP215",
    name: "Dr. Rohan Gupta",
    department: "Artificial Intelligence",
    designation: "Associate Professor",
  },
  {
    id: "EMP318",
    name: "Dr. Neha Arora",
    department: "Information Technology",
    designation: "Assistant Professor",
  },
];

const SubmissionForm = ({
  title,
  category,
  basicFields = {
    title: "Research Title",
    domain: "Research Domain",
    dropdown: "",
  },
  dropdownOptions = [],
  verificationLabels = {
    first: "DOI",
    second: "Scopus Link",
    third: "Publisher Link",
    fourth: "Journal Website",
  },
  formData = { authors: [] },
  handleInputChange,
  handleAddAuthor,
  handleRemoveAuthor,
  onSubmit,
  onDraft,
  children,
}) => {
  const [nameFilter, setNameFilter] = useState("");

  const filteredFaculty = dummyFaculty.filter((faculty) => {
    const search = nameFilter.toLowerCase();
    return (
      faculty.name.toLowerCase().includes(search) ||
      faculty.id.toLowerCase().includes(search) ||
      faculty.department.toLowerCase().includes(search)
    );
  });

  return (
    <Card className="max-w-7xl mx-auto p-8 space-y-8">
      {/* HEADER */}
      <div className="border-b pb-5">
        <Badge variant="primary">{category}</Badge>
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
      </div>

      {/* BASIC INFORMATION */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Input 
            label={basicFields.title} 
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
          />
          <Input 
            label={basicFields.domain} 
            name="domain"
            value={formData.domain || ""}
            onChange={handleInputChange}
          />
          {dropdownOptions.length > 0 && (
            <div>
              <label className="text-xs uppercase text-zinc-500">
                {basicFields.dropdown}
              </label>
              <select
                name="dropdown"
                value={formData.dropdown || ""}
                onChange={handleInputChange}
                className="border rounded-md px-3 py-2 w-full mt-1.5"
              >
                <option value="">Select</option>
                {dropdownOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* AUTHORS */}
      <section className="border-t pt-8 space-y-5">
        <h2 className="text-lg font-semibold">Authors</h2>
        <Input
          label="Search Authors"
          placeholder="Search by Name, Employee ID or Department"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        {nameFilter && (
          <Card className="p-0">
            {filteredFaculty.map((faculty) => (
              <button
                key={faculty.id}
                onClick={() => {
                  handleAddAuthor(faculty);
                  setNameFilter("");
                }}
                className="w-full p-3 text-left border-b hover:bg-zinc-50"
              >
                <p>{faculty.name}</p>
                <p className="text-xs text-zinc-500">
                  {faculty.department} • {faculty.id}
                </p>
              </button>
            ))}
          </Card>
        )}
        <div className="flex flex-wrap gap-3">
          {(formData.authors || []).map((author) => (
            <div key={author.id} className="border rounded-xl p-4 w-64 relative">
              <button 
                onClick={() => handleRemoveAuthor(author.id)}
                className="absolute top-2 right-3 text-zinc-400 hover:text-red-500"
              >
                ×
              </button>
              <p className="font-medium">{author.name}</p>
              <p className="text-xs text-zinc-500">{author.designation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFICATION LINKS */}
      <section className="border-t pt-8 space-y-5">
        <h2 className="text-lg font-semibold">Verification Links</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Input 
            label={verificationLabels.first} 
            type={verificationLabels.first.toLowerCase().match(/(link|url|website)/) ? "url" : "text"}
            pattern={verificationLabels.first.toLowerCase().match(/(link|url|website)/) ? "https://.*" : undefined}
            title={verificationLabels.first.toLowerCase().match(/(link|url|website)/) ? "Must be a valid HTTPS URL (e.g., https://example.com)" : undefined}
            placeholder={verificationLabels.first.toLowerCase().match(/(link|url|website)/) ? "https://..." : "Enter detail"} 
            name="firstVerification"
            value={formData.firstVerification || ""}
            onChange={handleInputChange}
          />
          <Input 
            label={verificationLabels.second} 
            type={verificationLabels.second.toLowerCase().match(/(link|url|website)/) ? "url" : "text"}
            pattern={verificationLabels.second.toLowerCase().match(/(link|url|website)/) ? "https://.*" : undefined}
            title={verificationLabels.second.toLowerCase().match(/(link|url|website)/) ? "Must be a valid HTTPS URL (e.g., https://example.com)" : undefined}
            placeholder={verificationLabels.second.toLowerCase().match(/(link|url|website)/) ? "https://..." : "Enter detail"} 
            name="secondVerification"
            value={formData.secondVerification || ""}
            onChange={handleInputChange}
          />
          <Input 
            label={verificationLabels.third} 
            type={verificationLabels.third.toLowerCase().match(/(link|url|website)/) ? "url" : "text"}
            pattern={verificationLabels.third.toLowerCase().match(/(link|url|website)/) ? "https://.*" : undefined}
            title={verificationLabels.third.toLowerCase().match(/(link|url|website)/) ? "Must be a valid HTTPS URL (e.g., https://example.com)" : undefined}
            placeholder={verificationLabels.third.toLowerCase().match(/(link|url|website)/) ? "https://..." : "Enter detail"} 
            name="thirdVerification"
            value={formData.thirdVerification || ""}
            onChange={handleInputChange}
          />
          <Input 
            label={verificationLabels.fourth} 
            type={verificationLabels.fourth.toLowerCase().match(/(link|url|website)/) ? "url" : "text"}
            pattern={verificationLabels.fourth.toLowerCase().match(/(link|url|website)/) ? "https://.*" : undefined}
            title={verificationLabels.fourth.toLowerCase().match(/(link|url|website)/) ? "Must be a valid HTTPS URL (e.g., https://example.com)" : undefined}
            placeholder={verificationLabels.fourth.toLowerCase().match(/(link|url|website)/) ? "https://..." : "Enter detail"} 
            name="fourthVerification"
            value={formData.fourthVerification || ""}
            onChange={handleInputChange}
          />
        </div>
      </section>

      {/* PAGE SPECIFIC */}
      <section className="border-t pt-8">{children}</section>

      {/* ACTIONS */}
      <div className="border-t pt-8 flex justify-between">
        <Button variant="outline" onClick={onDraft}>Save Draft</Button>
        <div className="flex gap-3">
          <Button variant="secondary">Preview</Button>
          <Button variant="primary" onClick={onSubmit}>Submit</Button>
        </div>
      </div>
    </Card>
  );
};

export default SubmissionForm;
