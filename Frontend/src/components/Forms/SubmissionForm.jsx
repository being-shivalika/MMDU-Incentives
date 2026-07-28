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
  const [isMMDUAuthor, setIsMMDUAuthor] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [externalAuthorName, setExternalAuthorName] = useState("");

  const filteredFaculty = dummyFaculty.filter((faculty) => {
    const search = nameFilter.toLowerCase();

    const matchesDepartment =
      selectedDepartment === "" || faculty.department === selectedDepartment;

    const matchesSearch =
      search === "" ||
      faculty.name.toLowerCase().includes(search) ||
      faculty.id.toLowerCase().includes(search);

    return matchesDepartment && matchesSearch;
  });

  const handleAddExternalAuthor = () => {
    if (!externalAuthorName.trim()) return;

    // Create an author object for non-MMDU authors
    const newAuthor = {
      id: `EXT_${Date.now()}`,
      name: externalAuthorName.trim(),
      department: "External / Other Institution",
      designation: "External Author",
    };

    handleAddAuthor(newAuthor);
    setExternalAuthorName("");
  };

  return (
    <Card className="max-w-7xl mx-auto p-8 space-y-2">
      {/* HEADER */}
      <div className="pb-2">
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
                className="border rounded-md px-3 py-1 w-full"
              >
                <option value="">Select</option>

                {dropdownOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* AUTHORS */}
      <section className="pt-4 space-y-4">
        <h2 className="text-lg font-semibold">Authors</h2>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isMMDUAuthor}
            onChange={(e) => {
              setIsMMDUAuthor(e.target.checked);
              setSelectedDepartment("");
              setNameFilter("");
              setExternalAuthorName("");
            }}
          />
          <span>Author is from MMDU</span>
        </label>

        {isMMDUAuthor ? (
          /* MMDU AUTHOR FLOW */
          <>
            <div>
              <label className="block text-xs uppercase text-zinc-500 mb-1">
                Department
              </label>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border rounded-md px-3 py-2 w-1/2"
              >
                <option value="">All Departments</option>

                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Search Authors"
              placeholder="Search by Name or Employee ID"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />

            {nameFilter && (
              <Card className="p-0 max-h-72 overflow-y-auto">
                {filteredFaculty.length > 0 ? (
                  filteredFaculty.map((faculty) => (
                    <button
                      key={faculty.id}
                      type="button"
                      onClick={() => {
                        handleAddAuthor(faculty);
                        setNameFilter("");
                      }}
                      className="w-full p-3 text-left hover:bg-zinc-50 border-b last:border-b-0"
                    >
                      <p className="font-medium">{faculty.name}</p>

                      <p className="text-xs text-zinc-500">
                        {faculty.department} • {faculty.designation} •{" "}
                        {faculty.id}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-sm text-zinc-500">No faculty found.</p>
                )}
              </Card>
            )}
          </>
        ) : (
          /* EXTERNAL AUTHOR FLOW */
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Author Name"
                placeholder="Enter author's full name"
                value={externalAuthorName}
                onChange={(e) => setExternalAuthorName(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddExternalAuthor}
            >
              Add Author
            </Button>
          </div>
        )}

        {/* SELECTED AUTHORS LIST */}
        <div className="flex flex-wrap gap-3">
          {(formData.authors || []).map((author) => (
            <div
              key={author.id}
              className="border rounded-xl p-4 w-64 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveAuthor(author.id)}
                className="absolute top-2 right-3 text-zinc-400 hover:text-red-500"
              >
                ×
              </button>

              <p className="font-medium">{author.name}</p>

              <p className="text-xs text-zinc-500">{author.designation}</p>

              <p className="text-xs text-zinc-400">{author.department}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFICATION LINKS */}
      <section className="pt-6 space-y-2">
        <h2 className="text-lg font-semibold">Verification Links</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label={verificationLabels.first}
            type={
              verificationLabels.first.toLowerCase().match(/(link|url|website)/)
                ? "url"
                : "text"
            }
            pattern={
              verificationLabels.first.toLowerCase().match(/(link|url|website)/)
                ? "https://.*"
                : undefined
            }
            title={
              verificationLabels.first.toLowerCase().match(/(link|url|website)/)
                ? "Must be a valid HTTPS URL (e.g., https://example.com)"
                : undefined
            }
            placeholder={
              verificationLabels.first.toLowerCase().match(/(link|url|website)/)
                ? "https://..."
                : "Enter detail"
            }
            name="firstVerification"
            value={formData.firstVerification || ""}
            onChange={handleInputChange}
          />

          <Input
            label={verificationLabels.second}
            type={
              verificationLabels.second
                .toLowerCase()
                .match(/(link|url|website)/)
                ? "url"
                : "text"
            }
            pattern={
              verificationLabels.second
                .toLowerCase()
                .match(/(link|url|website)/)
                ? "https://.*"
                : undefined
            }
            title={
              verificationLabels.second
                .toLowerCase()
                .match(/(link|url|website)/)
                ? "Must be a valid HTTPS URL (e.g., https://example.com)"
                : undefined
            }
            placeholder={
              verificationLabels.second
                .toLowerCase()
                .match(/(link|url|website)/)
                ? "https://..."
                : "Enter detail"
            }
            name="secondVerification"
            value={formData.secondVerification || ""}
            onChange={handleInputChange}
          />
        </div>
      </section>

      {/* PAGE SPECIFIC */}
      <section className="pt-6">{children}</section>

      {/* ACTIONS */}
      <div className="pt-6 flex justify-between">
        <Button variant="outline" onClick={onDraft}>
          Save Draft
        </Button>

        <div className="flex gap-3">
          <Button variant="secondary">Preview</Button>

          <Button variant="primary" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubmissionForm;
