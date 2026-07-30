import React, { useState } from "react";
import Card from "../Ui/Card";
import Badge from "../Ui/Badge";
import Input from "../Ui/Input";
import Button from "../Ui/Button";
import {
  Users,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertCircle,
  Building2,
  X,
} from "lucide-react";

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
    email: "anjali.sharma@mmdu.ac.in",
  },
  {
    id: "EMP215",
    name: "Dr. Rohan Gupta",
    department: "Artificial Intelligence",
    designation: "Associate Professor",
    email: "rohan.gupta@mmdu.ac.in",
  },
  {
    id: "EMP318",
    name: "Dr. Neha Arora",
    department: "Information Technology",
    designation: "Assistant Professor",
    email: "neha.arora@mmdu.ac.in",
  },
  {
    id: "EMP402",
    name: "Dr. Vikram Singh",
    department: "Electronics & Communication",
    designation: "Professor",
    email: "vikram.singh@mmdu.ac.in",
  },
  {
    id: "EMP509",
    name: "Dr. Sunita Verma",
    department: "Mechanical Engineering",
    designation: "Associate Professor",
    email: "sunita.verma@mmdu.ac.in",
  },
  {
    id: "EMP612",
    name: "Dr. Rajesh Kumar",
    department: "Civil Engineering",
    designation: "Professor",
    email: "rajesh.kumar@mmdu.ac.in",
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
  formData = { authors: [], totalAuthorsCount: "" },
  handleInputChange,
  handleAddAuthor,
  handleRemoveAuthor,
  onSubmit,
  onDraft,
  children,
}) => {
  const currentAuthors = Array.isArray(formData?.authors) ? formData.authors : [];
  const rawCount = parseInt(formData?.totalAuthorsCount, 10);
  const totalAuthorsRequired =
    isNaN(rawCount) || rawCount <= 0 ? 0 : Math.min(rawCount, 10);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const checkMmduAuthorRequirement = () => {
    const mmduAuthorExists = activeAuthorSlots.some(
      (a) => a && a.isMmdu !== false && String(a.name || "").trim() !== ""
    );

    if (!mmduAuthorExists) {
      setToastMessage("At least one author must be from MMDU.");
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    if (!checkMmduAuthorRequirement()) return;
    if (onSubmit) onSubmit(e);
  };

  const handleFormDraft = (e) => {
    if (!checkMmduAuthorRequirement()) return;
    if (onDraft) onDraft(e);
  };

  const getDepartmentSuggestions = (slotIndex) => {
    const author = currentAuthors[slotIndex] || {};
    const val = String(author.department || "").toLowerCase().trim();
    return departments.filter((d) => String(d).toLowerCase().includes(val));
  };

  const getEmpIdSuggestions = (slotIndex) => {
    const author = currentAuthors[slotIndex] || {};
    const dept = String(author.department || "").toLowerCase().trim();
    const empId = String(author.employeeId || author.id || "").toLowerCase().trim();
    const name = String(author.name || "").toLowerCase().trim();

    return dummyFaculty.filter((f) => {
      const fDept = String(f.department || "").toLowerCase();
      const fId = String(f.id || "").toLowerCase();
      const fName = String(f.name || "").toLowerCase();

      const matchDept = !dept || fDept.includes(dept);
      const matchEmpId = !empId || fId.includes(empId);
      const matchName = !name || fName.includes(name);
      return matchDept && matchEmpId && matchName;
    });
  };

  const getNameSuggestions = (slotIndex) => {
    const author = currentAuthors[slotIndex] || {};
    const dept = String(author.department || "").toLowerCase().trim();
    const empId = String(author.employeeId || author.id || "").toLowerCase().trim();
    const name = String(author.name || "").toLowerCase().trim();

    return dummyFaculty.filter((f) => {
      const fDept = String(f.department || "").toLowerCase();
      const fId = String(f.id || "").toLowerCase();
      const fName = String(f.name || "").toLowerCase();

      const matchDept = !dept || fDept.includes(dept);
      const matchEmpId = !empId || fId.includes(empId);
      const matchName = !name || fName.includes(name);
      return matchDept && matchEmpId && matchName;
    });
  };

  const handleSelectFaculty = (index, faculty) => {
    handleUpdateAuthorSlot(index, {
      id: faculty.id,
      employeeId: faculty.id,
      name: faculty.name,
      department: faculty.department,
      designation: faculty.designation,
      institution: "MMDU",
      isMmdu: true,
    });
    setActiveDropdown(null);
  };

  // Helper to update a specific author slot index
  const handleUpdateAuthorSlot = (index, fieldUpdates) => {
    const newAuthors = [...currentAuthors];

    // Ensure array is padded up to index
    for (let i = 0; i <= index; i++) {
      if (!newAuthors[i]) {
        newAuthors[i] = {
          id: `AUTH_${i + 1}_${Date.now()}`,
          isMmdu: true,
          name: "",
          employeeId: "",
          department: "",
          designation: "",
          institution: "MMDU",
        };
      }
    }

    newAuthors[index] = {
      ...newAuthors[index],
      ...fieldUpdates,
    };

    if (handleInputChange) {
      handleInputChange({
        target: {
          name: "authors",
          value: newAuthors.slice(0, totalAuthorsRequired > 0 ? totalAuthorsRequired : newAuthors.length),
        },
      });
    }
  };

  // Calculate active author slots safely
  const activeAuthorSlots = Array.from({ length: totalAuthorsRequired }).map(
    (_, i) =>
      currentAuthors[i] || {
        id: `AUTH_${i + 1}`,
        isMmdu: true,
        name: "",
        employeeId: "",
        department: "",
        designation: "",
        institution: "MMDU",
      }
  );

  const mmduAuthors = activeAuthorSlots.filter(
    (a) => a && a.isMmdu !== false && String(a.name || "").trim() !== ""
  );

  const mmduAuthorCount = mmduAuthors.length;
  const equalSharePercentage =
    mmduAuthorCount > 0 ? (100 / mmduAuthorCount).toFixed(1) : "0";

  return (
    <Card className="relative w-full bg-white border border-neutral-200 shadow-sm rounded-xl overflow-hidden p-0">
      {/* FLOATING TOAST NOTIFICATION BAR */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-red-900/95 text-white px-4 py-3 rounded-xl shadow-2xl border border-red-700 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-300" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:bg-red-800 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
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
          Basic Informations
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

      {/* DYNAMIC AUTHORS SECTION */}
      <section className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Authors & Contributors Details
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Specify total authors to unlock detail fields. Money slips are generated only for MMDU authors.
            </p>
          </div>

          {totalAuthorsRequired > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                {totalAuthorsRequired} Authors Unlocked
              </span>
            </div>
          )}
        </div>

        {/* INPUT FOR NUMBER OF AUTHORS */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-4 shadow-sm mb-6">
          <div className="max-w-md">
            <Input
              type="number"
              min="1"
              max="10"
              label="TOTAL NO. OF AUTHORS REQUIRED"
              name="totalAuthorsCount"
              placeholder="Enter number of authors (e.g. 3)"
              value={formData.totalAuthorsCount || ""}
              onChange={handleInputChange}
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Entering the number of authors will unlock exact fields below for each author.
            </p>
          </div>
        </div>

        {/* UNLOCKED AUTHOR CARDS */}
        {totalAuthorsRequired === 0 ? (
          <div className="p-8 text-center bg-white border border-dashed border-neutral-300 rounded-xl">
            <Users className="mx-auto text-neutral-300 mb-2" size={36} />
            <h3 className="text-sm font-semibold text-neutral-700">No Author Fields Unlocked Yet</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Please enter the <strong>Total No. of Authors Required</strong> above to unlock the details form for each author.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from({ length: totalAuthorsRequired }).map((_, index) => {
              const author = currentAuthors[index] || {
                isMmdu: true,
                name: "",
                employeeId: "",
                department: "",
                designation: "",
                institution: "MMDU",
              };

              const isMmdu = author.isMmdu !== false;

              return (
                <div
                  key={index}
                  className="bg-white border border-neutral-200/90 rounded-xl overflow-hidden shadow-sm transition-all hover:border-neutral-300"
                >
                  {/* SLOT HEADER */}
                  <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-white uppercase tracking-wider">
                        {index === 0 ? "1st Author (Primary)" : `Author #${index + 1}`}
                      </span>
                      <span className="text-xs font-medium text-neutral-600">
                        {author.name ? author.name : `Pending Information`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isMmdu ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <UserCheck size={12} /> MMDU Author (Money Slip Eligible)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                          <UserX size={12} /> External Author (No Money Share)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SLOT CONTENT */}
                  <div className="p-5 space-y-4">
                    {/* AFFILIATION QUESTION */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                        Is this Author from MMDU?
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-w-md">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateAuthorSlot(index, {
                              isMmdu: true,
                              institution: "MMDU",
                            })
                          }
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-2 ${
                            isMmdu
                              ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                              : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                          }`}
                        >
                          <Building2 size={14} /> Yes, MMDU Faculty / Staff
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateAuthorSlot(index, {
                              isMmdu: false,
                              employeeId: "",
                              institution: author.institution === "MMDU" ? "" : author.institution,
                            })
                          }
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-2 ${
                            !isMmdu
                              ? "bg-amber-50 border-amber-600 text-amber-800 shadow-sm"
                              : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                          }`}
                        >
                          <UserX size={14} /> No, External Author
                        </button>
                      </div>
                    </div>

                    {/* MMDU FACULTY SELECTION (MANUAL TYPING + AUTOFILL) */}
                    {isMmdu ? (
                      <div className="space-y-4 bg-neutral-50/70 p-4 rounded-xl border border-neutral-200/80">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 size={15} className="text-blue-600" /> MMDU Faculty Selection
                          </span>

                          {(author.name || author.employeeId || author.department) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateAuthorSlot(index, {
                                  department: "",
                                  employeeId: "",
                                  name: "",
                                  designation: "",
                                })
                              }
                              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                            >
                              Clear / Reset Fields
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* 1. TEACHER DEPARTMENT */}
                          <div className="relative">
                            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                              1. Teacher Department
                            </label>
                            <input
                              type="text"
                              placeholder="Type or select Department..."
                              value={author.department || ""}
                              onFocus={() => setActiveDropdown({ slotIndex: index, field: "dept" })}
                              onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                              onChange={(e) => {
                                handleUpdateAuthorSlot(index, { department: e.target.value });
                              }}
                              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />
                            {activeDropdown?.slotIndex === index && activeDropdown?.field === "dept" && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-40 overflow-y-auto divide-y divide-neutral-100">
                                {getDepartmentSuggestions(index).map((d) => (
                                  <button
                                    key={d}
                                    type="button"
                                    onMouseDown={() => {
                                      handleUpdateAuthorSlot(index, { department: d });
                                      setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs text-neutral-800 hover:bg-blue-50 font-medium"
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 2. TEACHER ROLL NO / EMP ID */}
                          <div className="relative">
                            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                              2. Teacher Roll No / Emp ID
                            </label>
                            <input
                              type="text"
                              placeholder="Type or select Roll No / Emp ID..."
                              value={author.employeeId || ""}
                              onFocus={() => setActiveDropdown({ slotIndex: index, field: "empId" })}
                              onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                              onChange={(e) => {
                                const typedId = e.target.value;
                                const matched = dummyFaculty.find(
                                  (f) => f.id.toLowerCase() === typedId.toLowerCase().trim()
                                );
                                if (matched) {
                                  handleSelectFaculty(index, matched);
                                } else {
                                  handleUpdateAuthorSlot(index, { employeeId: typedId });
                                }
                              }}
                              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono font-bold text-neutral-800 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />
                            {activeDropdown?.slotIndex === index && activeDropdown?.field === "empId" && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-neutral-100">
                                {getEmpIdSuggestions(index).length > 0 ? (
                                  getEmpIdSuggestions(index).map((f) => (
                                    <button
                                      key={f.id}
                                      type="button"
                                      onMouseDown={() => handleSelectFaculty(index, f)}
                                      className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between"
                                    >
                                      <div>
                                        <span className="text-xs font-mono font-bold text-blue-700 block">
                                          {f.id}
                                        </span>
                                        <span className="text-[11px] text-neutral-600">
                                          {f.name} • {f.department}
                                        </span>
                                      </div>
                                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                                        Autofill
                                      </span>
                                    </button>
                                  ))
                                ) : (
                                  <p className="px-3 py-2 text-xs text-neutral-400 text-center">
                                    No matching Roll No / Emp ID. You can type manually.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* 3. TEACHER NAME */}
                          <div className="relative">
                            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                              3. Teacher Name
                            </label>
                            <input
                              type="text"
                              placeholder="Type or select Teacher Name..."
                              value={author.name || ""}
                              onFocus={() => setActiveDropdown({ slotIndex: index, field: "name" })}
                              onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                              onChange={(e) => {
                                const typedName = e.target.value;
                                const matched = dummyFaculty.find(
                                  (f) => f.name.toLowerCase() === typedName.toLowerCase().trim()
                                );
                                if (matched) {
                                  handleSelectFaculty(index, matched);
                                } else {
                                  handleUpdateAuthorSlot(index, { name: typedName });
                                }
                              }}
                              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                            />
                            {activeDropdown?.slotIndex === index && activeDropdown?.field === "name" && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-neutral-100">
                                {getNameSuggestions(index).length > 0 ? (
                                  getNameSuggestions(index).map((f) => (
                                    <button
                                      key={f.id}
                                      type="button"
                                      onMouseDown={() => handleSelectFaculty(index, f)}
                                      className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between"
                                    >
                                      <div>
                                        <span className="text-xs font-bold text-neutral-800 block">
                                          {f.name}
                                        </span>
                                        <span className="text-[11px] text-neutral-500">
                                          Emp ID: {f.id} • {f.department}
                                        </span>
                                      </div>
                                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                                        Autofill
                                      </span>
                                    </button>
                                  ))
                                ) : (
                                  <p className="px-3 py-2 text-xs text-neutral-400 text-center">
                                    No matching Teacher Name. You can type manually.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* VERIFICATION & MATCH STATUS NOTICE */}
                        {author.name && author.employeeId && (
                          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-lg flex items-center justify-between gap-2 text-xs text-emerald-800">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                              <span>
                                <strong>MMDU Faculty Verified:</strong> {author.name} ({author.employeeId}) — {author.department || "MMDU"}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                              Incentive Eligible
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* EXTERNAL AUTHOR FORM */
                      <div className="space-y-3 bg-neutral-50/50 p-4 rounded-lg border border-neutral-200/60">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            label={`Author #${index + 1} Full Name`}
                            placeholder="e.g. Dr. Suresh Kumar"
                            value={author.name || ""}
                            onChange={(e) =>
                              handleUpdateAuthorSlot(index, { name: e.target.value })
                            }
                          />

                          <Input
                            label="Institution / Organization"
                            placeholder="e.g. IIT Delhi, Thapar University"
                            value={author.institution || ""}
                            onChange={(e) =>
                              handleUpdateAuthorSlot(index, { institution: e.target.value })
                            }
                          />

                          <Input
                            label="Designation (Optional)"
                            placeholder="e.g. Professor, Scientist"
                            value={author.designation || ""}
                            onChange={(e) =>
                              handleUpdateAuthorSlot(index, { designation: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
            label={verificationLabels.first}
            type={
              verificationLabels.first.toLowerCase().match(/(link|url|website)/)
                ? "url"
                : "text"
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
        <Button
          type="button"
          variant="outline"
          onClick={handleFormDraft}
          className="w-full sm:w-auto bg-white cursor-pointer"
        >
          Save Draft
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto bg-white cursor-pointer"
          >
            Preview
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleFormSubmit}
            className="w-full sm:w-auto cursor-pointer"
          >
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubmissionForm;
