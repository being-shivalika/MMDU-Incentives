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
  Pencil,
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
  const [newAuthor, setNewAuthor] = useState({
    isMmdu: true,
    name: "",
    employeeId: "",
    department: "",
    designation: "",
    institution: "MMDU",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const mmduAuthors = currentAuthors.filter(
    (a) => a && a.isMmdu !== false && String(a.name || "").trim() !== ""
  );
  const mmduAuthorCount = mmduAuthors.length;
  const equalSharePercentage =
    mmduAuthorCount > 0 ? (100 / mmduAuthorCount).toFixed(1) : "0";

  const checkMmduAuthorRequirement = () => {
    if (mmduAuthorCount === 0) {
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

  const getDepartmentSuggestions = (deptVal) => {
    const val = String(deptVal || "").toLowerCase().trim();
    return departments.filter((d) => String(d).toLowerCase().includes(val));
  };

  const getEmpIdSuggestions = (authorState) => {
    const dept = String(authorState?.department || "").toLowerCase().trim();
    const empId = String(authorState?.employeeId || authorState?.id || "").toLowerCase().trim();
    const name = String(authorState?.name || "").toLowerCase().trim();

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

  const getNameSuggestions = (authorState) => {
    const dept = String(authorState?.department || "").toLowerCase().trim();
    const empId = String(authorState?.employeeId || authorState?.id || "").toLowerCase().trim();
    const name = String(authorState?.name || "").toLowerCase().trim();

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

  const handleSelectFacultyToNewAuthor = (faculty) => {
    setNewAuthor({
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

  const handleEditAuthorIndex = (index) => {
    const authorToEdit = currentAuthors[index];
    if (!authorToEdit) return;
    setEditingIndex(index);
    setNewAuthor({
      id: authorToEdit.id || authorToEdit.employeeId || "",
      employeeId: authorToEdit.employeeId || authorToEdit.id || "",
      name: authorToEdit.name || "",
      department: authorToEdit.department || "",
      designation: authorToEdit.designation || "",
      institution: authorToEdit.institution || (authorToEdit.isMmdu !== false ? "MMDU" : ""),
      isMmdu: authorToEdit.isMmdu !== false,
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewAuthor({
      isMmdu: true,
      name: "",
      employeeId: "",
      department: "",
      designation: "",
      institution: "MMDU",
    });
    setActiveDropdown(null);
  };

  const handleAddAuthorSubmit = () => {
    if (!newAuthor.name || !newAuthor.name.trim()) {
      setToastMessage("Please enter or select author name before submitting.");
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const authorObj = {
      id: newAuthor.employeeId || newAuthor.id || `AUTH_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      employeeId: newAuthor.employeeId || "",
      name: newAuthor.name.trim(),
      department: newAuthor.department || (newAuthor.isMmdu ? "MMDU" : newAuthor.institution || "External"),
      designation: newAuthor.designation || "",
      institution: newAuthor.isMmdu ? "MMDU" : newAuthor.institution || "External",
      isMmdu: newAuthor.isMmdu !== false,
    };

    let updated;
    if (editingIndex !== null) {
      updated = [...currentAuthors];
      updated[editingIndex] = authorObj;
    } else {
      updated = [...currentAuthors, authorObj];
      if (handleAddAuthor) {
        handleAddAuthor(authorObj);
      }
    }

    if (handleInputChange) {
      handleInputChange({
        target: {
          name: "authors",
          value: updated,
        },
      });
    }

    // Reset editing and form state
    setEditingIndex(null);
    setNewAuthor({
      isMmdu: true,
      name: "",
      employeeId: "",
      department: "",
      designation: "",
      institution: "MMDU",
    });
    setActiveDropdown(null);
  };

  const handleRemoveAuthorIndex = (indexToRemove) => {
    const targetAuthor = currentAuthors[indexToRemove];
    const updated = currentAuthors.filter((_, i) => i !== indexToRemove);

    if (editingIndex === indexToRemove) {
      handleCancelEdit();
    } else if (editingIndex !== null && editingIndex > indexToRemove) {
      setEditingIndex(editingIndex - 1);
    }

    if (handleInputChange) {
      handleInputChange({
        target: {
          name: "authors",
          value: updated,
        },
      });
    }

    if (handleRemoveAuthor && targetAuthor) {
      handleRemoveAuthor(targetAuthor.id || targetAuthor.employeeId);
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Authors & Contributors Details
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Add authors using the field below. Money slips are generated only for MMDU authors.
            </p>
          </div>

          {currentAuthors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                {currentAuthors.length} Author{currentAuthors.length > 1 ? "s" : ""} Added
              </span>
              {mmduAuthorCount > 0 && (
                <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60">
                  {mmduAuthorCount} MMDU ({equalSharePercentage}% Share Each)
                </span>
              )}
            </div>
          )}
        </div>

        {/* 1. ADDED AUTHOR TILES (DISPLAYED TO THE TOP OF THE FIELD) */}
        <div className="mb-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2 block">
            Added Authors ({currentAuthors.length})
          </label>

          {currentAuthors.length === 0 ? (
            <div className="p-6 text-center bg-white border border-dashed border-neutral-300 rounded-xl">
              <Users className="mx-auto text-neutral-300 mb-2" size={32} />
              <p className="text-xs font-semibold text-neutral-700">No Authors Added Yet</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Use the single author field below to add MMDU faculty or external authors.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentAuthors.map((author, index) => {
                const isMmdu = author.isMmdu !== false;
                return (
                  <div
                    key={author.id || index}
                    className="bg-white border border-neutral-200/90 rounded-xl p-3.5 shadow-sm hover:border-neutral-300 transition-all flex flex-col justify-between relative group"
                  >
                    {/* Tile Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-white uppercase tracking-wider">
                        {index === 0 ? "1st Author (Primary)" : `Author #${index + 1}`}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isMmdu ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <UserCheck size={11} /> MMDU
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <UserX size={11} /> External
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleEditAuthorIndex(index)}
                          title="Edit Author Details"
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            editingIndex === index
                              ? "bg-amber-100 text-amber-700 font-bold"
                              : "text-neutral-400 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveAuthorIndex(index)}
                          title="Remove Author"
                          className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Information Tile Details */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-neutral-800 truncate">
                        {author.name || "Unnamed Author"}
                      </h4>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
                        {(author.employeeId || author.id) && (
                          <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                            ID: {author.employeeId || author.id}
                          </span>
                        )}
                        <span className="truncate">
                          {author.department || (isMmdu ? "MMDU" : author.institution || "External")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. SINGLE FIELD TO ADD / EDIT MULTIPLE AUTHORS */}
        <div className="bg-white border border-neutral-200/90 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              {editingIndex !== null ? (
                <>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Pencil size={15} className="text-amber-600" /> Editing Author #{editingIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 underline ml-2 cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                </>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                  <Building2 size={16} className="text-blue-600" /> Add Author Field
                </span>
              )}
            </div>

            {/* Affiliation Mode Selector */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() =>
                  setNewAuthor((prev) => ({
                    ...prev,
                    isMmdu: true,
                    institution: "MMDU",
                  }))
                }
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  newAuthor.isMmdu
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Building2 size={13} /> MMDU Faculty / Staff
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewAuthor((prev) => ({
                    ...prev,
                    isMmdu: false,
                    employeeId: "",
                    institution: "",
                  }))
                }
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  !newAuthor.isMmdu
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <UserX size={13} /> External Author
              </button>
            </div>
          </div>

          {/* Form Inputs for Single Author Entry */}
          {newAuthor.isMmdu ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Department */}
              <div className="relative">
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                  1. Teacher Department
                </label>
                <input
                  type="text"
                  placeholder="Type or select Department..."
                  value={newAuthor.department || ""}
                  onFocus={() => setActiveDropdown({ field: "dept" })}
                  onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                  onChange={(e) =>
                    setNewAuthor((prev) => ({ ...prev, department: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAuthorSubmit();
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                {activeDropdown?.field === "dept" && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-40 overflow-y-auto divide-y divide-neutral-100">
                    {getDepartmentSuggestions(newAuthor.department).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onMouseDown={() => {
                          setNewAuthor((prev) => ({ ...prev, department: d }));
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-neutral-800 hover:bg-blue-50 font-medium cursor-pointer"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Teacher Roll No / Emp ID */}
              <div className="relative">
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                  2. Teacher Roll No / Emp ID
                </label>
                <input
                  type="text"
                  placeholder="Type or select Emp ID..."
                  value={newAuthor.employeeId || ""}
                  onFocus={() => setActiveDropdown({ field: "empId" })}
                  onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                  onChange={(e) => {
                    const typedId = e.target.value;
                    const matched = dummyFaculty.find(
                      (f) => f.id.toLowerCase() === typedId.toLowerCase().trim()
                    );
                    if (matched) {
                      handleSelectFacultyToNewAuthor(matched);
                    } else {
                      setNewAuthor((prev) => ({ ...prev, employeeId: typedId }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAuthorSubmit();
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-mono font-bold text-neutral-800 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                {activeDropdown?.field === "empId" && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-neutral-100">
                    {getEmpIdSuggestions(newAuthor).length > 0 ? (
                      getEmpIdSuggestions(newAuthor).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onMouseDown={() => handleSelectFacultyToNewAuthor(f)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer"
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
                        No matching Emp ID. You can type manually.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Teacher Name */}
              <div className="relative">
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                  3. Teacher Name
                </label>
                <input
                  type="text"
                  placeholder="Type or select Name..."
                  value={newAuthor.name || ""}
                  onFocus={() => setActiveDropdown({ field: "name" })}
                  onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                  onChange={(e) => {
                    const typedName = e.target.value;
                    const matched = dummyFaculty.find(
                      (f) => f.name.toLowerCase() === typedName.toLowerCase().trim()
                    );
                    if (matched) {
                      handleSelectFacultyToNewAuthor(matched);
                    } else {
                      setNewAuthor((prev) => ({ ...prev, name: typedName }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAuthorSubmit();
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                {activeDropdown?.field === "name" && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-neutral-100">
                    {getNameSuggestions(newAuthor).length > 0 ? (
                      getNameSuggestions(newAuthor).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onMouseDown={() => handleSelectFacultyToNewAuthor(f)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer"
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
                        No matching Name. You can type manually.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Author Full Name"
                placeholder="e.g. Dr. Suresh Kumar"
                value={newAuthor.name || ""}
                onChange={(e) => setNewAuthor((prev) => ({ ...prev, name: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAuthorSubmit();
                  }
                }}
              />

              <Input
                label="Institution / Organization"
                placeholder="e.g. IIT Delhi, Thapar Univ"
                value={newAuthor.institution || ""}
                onChange={(e) =>
                  setNewAuthor((prev) => ({ ...prev, institution: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAuthorSubmit();
                  }
                }}
              />

              <Input
                label="Designation (Optional)"
                placeholder="e.g. Professor, Scientist"
                value={newAuthor.designation || ""}
                onChange={(e) =>
                  setNewAuthor((prev) => ({ ...prev, designation: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAuthorSubmit();
                  }
                }}
              />
            </div>
          )}

          {/* Action to Add / Update Author */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
            {newAuthor.name && newAuthor.employeeId && newAuthor.isMmdu ? (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Faculty verified: {newAuthor.name} ({newAuthor.employeeId})
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400">
                {editingIndex !== null
                  ? `Modify details above and click Update`
                  : `Fill details above and click Add Author`}
              </span>
            )}

            <button
              type="button"
              onClick={handleAddAuthorSubmit}
              className={`px-4 py-2 text-white font-semibold text-xs rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer ${
                editingIndex !== null
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editingIndex !== null ? (
                <>
                  <CheckCircle2 size={14} /> Update Author Details
                </>
              ) : (
                <>
                  + Add Author to List
                </>
              )}
            </button>
          </div>
        </div>
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
