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
  showResearchSection = false,
  basicFields = {
    title: "Research Title",
    domain: "Research Domain",
    dropdown: "",
  },
  dropdownOptions = [],
  verificationLabels = {},
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

  const labels = {
    first: verificationLabels?.first || "DOI",
    second: verificationLabels?.second || "Scopus Link",
  };

  const currentAuthors = formData.authors || [];
  const nextAuthorNumber = currentAuthors.length + 1;

  // Maximum allowed authors check
  const maxAuthorsAllowed = parseInt(formData.totalAuthorsCount, 10);
  const isMaxAuthorsReached =
    !isNaN(maxAuthorsAllowed) &&
    maxAuthorsAllowed > 0 &&
    currentAuthors.length >= maxAuthorsAllowed;

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
    if (!externalAuthorName.trim() || isMaxAuthorsReached) return;

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
    <Card className="max-w-6xl mx-auto p-6 space-y-2 relative border-none shadow-none">
      {/* HEADER */}
      <div>
        <Badge variant="primary">{category}</Badge>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
      </div>

      {/* BASIC INFORMATION */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold mb-1">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
              <label className="text-xs uppercase text-zinc-500 block mb-1">
                {basicFields.dropdown}
              </label>

              <select
                name="dropdown"
                value={formData.dropdown || ""}
                onChange={handleInputChange}
                className="rounded-md px-3 py-2 w-full text-sm bg-zinc-50"
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

      {/* RESEARCH INFORMATION */}
      {showResearchSection && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold mb-1">Research Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Input
              label="Journal / Conference Name"
              name="journalName"
              value={formData.journalName || ""}
              onChange={handleInputChange}
            />

            <Input
              label="Publisher"
              name="publisher"
              value={formData.publisher || ""}
              onChange={handleInputChange}
            />

            <Input
              label="ISSN / ISBN"
              name="issn"
              value={formData.issn || ""}
              onChange={handleInputChange}
            />

            <Input
              type="date"
              label="Publication Date"
              name="publicationDate"
              value={formData.publicationDate || ""}
              onChange={handleInputChange}
            />
          </div>
        </section>
      )}

      {/* AUTHORS SECTION */}
      <section className="space-y-4">
        {/* TOP HEADER: TOTAL AUTHORS QUESTION */}
        <div className="flex flex-wrap items-center justify-start gap-6">
          <div>
            <h2 className="text-base font-semibold">Authors</h2>
            <p className="text-xs text-zinc-500">
              Specify author count and add details sequentially.
            </p>
          </div>

          <div className="w-50 ">
            <Input
              type="number"
              min="1"
              label="Total No. of Authors"
              name="totalAuthorsCount"
              placeholder="e.g. 3"
              value={formData.totalAuthorsCount || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT: TABULAR LIST (LEFT) | ADD AUTHOR CONTROLS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDE: TABULAR LIST OF AUTHORS */}
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs font-semibold uppercase text-zinc-500">
              Added Authors ({currentAuthors.length}
              {formData.totalAuthorsCount
                ? ` / ${formData.totalAuthorsCount}`
                : ""}
              )
            </span>

            <div className="max-h-72 overflow-y-auto bg-zinc-50 rounded-lg p-2">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-zinc-400 uppercase">
                  <tr>
                    <th className="py-2 px-3 w-10">#</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Department / Inst.</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/60">
                  {currentAuthors.length > 0 ? (
                    currentAuthors.map((author, index) => (
                      <tr key={author.id}>
                        <td className="py-2.5 px-3 font-semibold text-zinc-400 text-xs">
                          #{index + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-medium text-zinc-800 text-sm">
                            {author.name}
                          </p>
                          <span className="text-[10px] text-zinc-400 block">
                            {author.designation}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-zinc-500">
                          {author.department}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveAuthor(author.id)}
                            className="text-zinc-400 hover:text-red-500 text-base leading-none"
                            title="Remove author"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-xs text-zinc-400"
                      >
                        No authors added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDE: AUTHOR SELECTION & FILTERS */}
          <div className="lg:col-span-6 space-y-4 bg-zinc-50 p-4 rounded-lg">
            {isMaxAuthorsReached ? (
              <div className="py-6 text-center text-xs text-amber-600 bg-amber-50 rounded-md border border-amber-200">
                All the Authors ({formData.totalAuthorsCount}) are added. To add
                an author increase total count to add more.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-zinc-600">
                    Author #{nextAuthorNumber} Details
                  </span>

                  {/* MMDU AUTHOR CHECKBOX */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600">
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
                    Author is from MMDU
                  </label>
                </div>

                {/* IF MMDU -> SHOW DEPARTMENT FILTER & SEARCH */}
                {isMMDUAuthor ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs uppercase text-zinc-500 mb-1">
                        Department
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="rounded-md px-3 py-2 w-full text-sm bg-white"
                      >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <Input
                        label="Search Faculty"
                        placeholder="Search by Name or ID..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                      />

                      {nameFilter && (
                        <div className="max-h-40 overflow-y-auto absolute left-0 right-0 top-full mt-1 z-20 bg-white shadow-md rounded-md">
                          {filteredFaculty.length > 0 ? (
                            filteredFaculty.map((faculty) => (
                              <button
                                key={faculty.id}
                                type="button"
                                onClick={() => {
                                  if (!isMaxAuthorsReached) {
                                    handleAddAuthor(faculty);
                                    setNameFilter("");
                                  }
                                }}
                                className="w-full p-2.5 text-left hover:bg-zinc-100 text-xs text-zinc-800"
                              >
                                <p className="font-medium">{faculty.name}</p>
                                <p className="text-[10px] text-zinc-500">
                                  {faculty.department} • {faculty.id}
                                </p>
                              </button>
                            ))
                          ) : (
                            <p className="p-3 text-xs text-zinc-400">
                              No faculty found.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* IF EXTERNAL -> SHOW SIMPLE NAME INPUT */
                  <div className="space-y-3">
                    <Input
                      label={`Author #${nextAuthorNumber} Name`}
                      placeholder="Enter full name"
                      value={externalAuthorName}
                      onChange={(e) => setExternalAuthorName(e.target.value)}
                    />

                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      onClick={handleAddExternalAuthor}
                      disabled={isMaxAuthorsReached}
                    >
                      Add Author #{nextAuthorNumber}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* VERIFICATION & METRICS */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold mb-1">
          {showResearchSection
            ? "Verification Links & Metrics"
            : "Verification Links"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Input
            label={labels.first}
            type={
              labels.first.toLowerCase().match(/(link|url|website)/)
                ? "url"
                : "text"
            }
            pattern={
              labels.first.toLowerCase().match(/(link|url|website)/)
                ? "https://.*"
                : undefined
            }
            placeholder={
              labels.first.toLowerCase().match(/(link|url|website)/)
                ? "https://..."
                : "Enter detail"
            }
            name="firstVerification"
            value={formData.firstVerification || ""}
            onChange={handleInputChange}
          />

          <Input
            label={labels.second}
            type={
              labels.second.toLowerCase().match(/(link|url|website)/)
                ? "url"
                : "text"
            }
            pattern={
              labels.second.toLowerCase().match(/(link|url|website)/)
                ? "https://.*"
                : undefined
            }
            placeholder={
              labels.second.toLowerCase().match(/(link|url|website)/)
                ? "https://..."
                : "Enter detail"
            }
            name="secondVerification"
            value={formData.secondVerification || ""}
            onChange={handleInputChange}
          />

          {showResearchSection && (
            <>
              <div>
                <label className="text-xs uppercase text-zinc-500 block mb-1">
                  Quartile
                </label>
                <select
                  name="quartile"
                  value={formData?.quartile || ""}
                  onChange={handleInputChange}
                  className="rounded-md px-3 py-2 w-full text-sm bg-zinc-50"
                >
                  <option value="">Select Quartile</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase text-zinc-500 block mb-1">
                  Impact Factor
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="impactFactor"
                  placeholder="e.g. 5.4"
                  value={formData?.impactFactor || ""}
                  onChange={handleInputChange}
                  className="rounded-md px-3 py-2 w-full text-sm bg-zinc-50"
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* CHILDREN */}
      <section className="space-y-3">{children}</section>

      {/* ACTIONS */}
      <div className="sticky bottom-0 bg-white py-4 flex justify-between z-10">
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
