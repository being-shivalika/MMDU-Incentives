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
  verificationLabels = {
    first: "DOI",
    second: "Scopus Link",
    third: "Publisher Link",
    fourth: "Journal Website",
  },
  formData = { authors: [] }, // Changed back to generic 'authors'
  handleInputChange,
  handleAddAuthor,
  handleRemoveAuthor,
  onSubmit,
  onDraft,
  children,
}) => {
  const [isMMDUAuthor, setIsMMDUAuthor] = useState(true); 
  
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
      designation: "External Author"
    };

    handleAddAuthor(newAuthor);
    setExternalAuthorName("");
  };

  return (
    <Card className="w-full bg-white border border-neutral-200 shadow-sm rounded-xl overflow-hidden p-0">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50/50">
        <div className="mb-3">
          <Badge variant="primary">{category}</Badge>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-800">
          {title}
        </h1>
      </div>

      {/* BASIC INFORMATION */}
      <section className="px-6 py-5 border-b border-neutral-100">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-4">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                {basicFields.dropdown}
              </label>
              <select
                name="dropdown"
                value={formData.dropdown || ""}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
              >
                <option value="">Select an option</option>
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
      <section className="px-6 py-5 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Authors Details
          </h2>
          
          {/* AFFILIATION TOGGLE */}
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => {
                setIsMMDUAuthor(true);
                setExternalAuthorName("");
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                isMMDUAuthor
                  ? "bg-white text-neutral-800 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              MMDU Faculty
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMMDUAuthor(false);
                setSelectedDepartment("");
                setNameFilter("");
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                !isMMDUAuthor
                  ? "bg-white text-neutral-800 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              External Author
            </button>
          </div>
        </div>

        {isMMDUAuthor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
              >
                <option value="">All Departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Input
                label={formData.authors?.length > 0 ? "Search & Add Co-Author" : "Search & Add First Author"}
                placeholder="Search by Name or Employee ID"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
              {nameFilter && (
                <div className="absolute top-full left-0 z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
                  {filteredFaculty.length > 0 ? (
                    filteredFaculty.map((faculty) => (
                      <button
                        key={faculty.id}
                        type="button"
                        onClick={() => {
                          handleAddAuthor(faculty);
                          setNameFilter("");
                        }}
                        className="flex w-full flex-col items-start border-b border-neutral-100 px-3 py-2 text-left transition-colors hover:bg-neutral-50 last:border-0"
                      >
                        <span className="text-sm font-semibold text-neutral-800">
                          {faculty.name}
                        </span>
                        <span className="text-xs font-medium text-neutral-500">
                          {faculty.department} • {faculty.designation}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-neutral-500 text-center">
                      No faculty found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <Input
                label={formData.authors?.length > 0 ? "Add External Co-Author" : "Add External First Author"}
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
        {formData.authors?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5 pt-5 border-t border-neutral-100">
            {formData.authors.map((author, index) => (
              <div
                key={author.id}
                className="group relative flex flex-col justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3 pr-8 transition-colors hover:border-neutral-300"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveAuthor(author.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-800"
                  aria-label="Remove author"
                >
                  <span className="text-lg leading-none font-medium">×</span>
                </button>

                {/* AUTOMATIC ROLE ASSIGNMENT BASED ON POSITION */}
                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 w-fit px-1.5 py-0.5 rounded ${
                  index === 0 ? "bg-amber-100 text-amber-800" : "bg-neutral-200 text-neutral-700"
                }`}>
                  {index === 0 ? "First Author" : "Co-Author"}
                </span>

                <div className="flex items-center gap-2 mb-0.5 mt-1">
                  <p className="text-sm font-semibold text-neutral-800 truncate">
                    {author.name}
                  </p>
                  {author.id.startsWith("EXT_") ? (
                    <span className="text-[9px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Ext</span>
                  ) : (
                    <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">MMDU</span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 truncate">
                  {author.designation} • {author.department}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* VERIFICATION LINKS */}
      <section className="px-6 py-5 border-b border-neutral-100">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-4">
          Verification Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={labels.first}
            type={
              labels.first.toLowerCase().match(/(link|url|website)/)
                ? "url"
                : "text"
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
              verificationLabels.second.toLowerCase().match(/(link|url|website)/)
                ? "url"
                : "text"
            }
            placeholder={
              verificationLabels.second.toLowerCase().match(/(link|url|website)/)
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

      {/* PAGE SPECIFIC */}
      {children && (
        <section className="px-6 py-5 border-b border-neutral-100">
          {children}
        </section>
      )}

      {/* ACTIONS */}
      <div className="px-6 py-4 bg-neutral-50 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onDraft} className="w-full sm:w-auto bg-white">
          Save Draft
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button type="button" variant="secondary" className="w-full sm:w-auto bg-white">
            Preview
          </Button>
          <Button type="button" variant="primary" onClick={onSubmit} className="w-full sm:w-auto">
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubmissionForm;