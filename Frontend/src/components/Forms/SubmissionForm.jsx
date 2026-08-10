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
  Lock,
} from "lucide-react";

const departments = [
  "Computer Science & Engineering",
  "Information Technology",
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Communication Engineering",
  "Biotechnology",
  "Management Studies (MBA)",
  "Computer Applications (MCA)",
  "Pharmacy",
  "Nursing",
  "Physiotherapy",
  "Law",
  "Medical Sciences",
  "Dental Sciences",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Humanities & Social Sciences",
  "Agriculture & Food Technology",
];

const dummyMembers = [
  // Faculty
  {
    id: "EMP101",
    name: "Dr. Anjali Sharma",
    department: "Computer Science & Engineering",
    designation: "Professor",
    email: "anjali.sharma@mmdu.ac.in",
    role: "faculty",
    isMmdu: true,
  },
  {
    id: "EMP215",
    name: "Dr. Rohan Gupta",
    department: "Software Engineering",
    designation: "Associate Professor",
    email: "rohan.gupta@mmdu.ac.in",
    role: "faculty",
    isMmdu: true,
  },
  {
    id: "EMP318",
    name: "Dr. Neha Arora",
    department: "Information Technology",
    designation: "Assistant Professor",
    email: "neha.arora@mmdu.ac.in",
    role: "faculty",
    isMmdu: true,
  },
  {
    id: "EMP402",
    name: "Dr. Vikram Singh",
    department: "Electronics & Communication Engineering",
    designation: "Professor",
    email: "vikram.singh@mmdu.ac.in",
    role: "faculty",
    isMmdu: true,
  },
  {
    id: "EMP509",
    name: "Dr. Sunita Verma",
    department: "Mechanical Engineering",
    designation: "Associate Professor",
    email: "sunita.verma@mmdu.ac.in",
    role: "faculty",
    isMmdu: true,
  },
  {
    id: "EMP612",
    name: "Dr. Rajesh Kumar",
    department: "Civil Engineering",
    designation: "Professor",
    email: "rajesh.kumar@mmdu.ac.in",
    role: "faculty",
    isMmdu: true,
  },
  // Students
  {
    id: "STU901",
    name: "Aarav Sharma",
    department: "Computer Science & Engineering",
    designation: "B.Tech Student",
    email: "aarav.stu@mmdu.ac.in",
    role: "student",
    isMmdu: true,
  },
  {
    id: "STU902",
    name: "Priya Patel",
    department: "Information Technology",
    designation: "M.Tech Research Scholar",
    email: "priya.stu@mmdu.ac.in",
    role: "student",
    isMmdu: true,
  },
  {
    id: "STU903",
    name: "Rohan Verma",
    department: "Pharmacy",
    designation: "Ph.D Scholar",
    email: "rohan.stu@mmdu.ac.in",
    role: "student",
    isMmdu: true,
  },
  {
    id: "STU904",
    name: "Simran Kaur",
    department: "Biotechnology",
    designation: "B.Sc Student",
    email: "simran.stu@mmdu.ac.in",
    role: "student",
    isMmdu: true,
  },
];

import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

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
  const { user } = useAuth();
  const currentAuthors = Array.isArray(formData?.authors) ? formData.authors : [];

  // Automatically add logged-in faculty as default 1st author if authors list is empty
  useEffect(() => {
    if (user && currentAuthors.length === 0) {
      const defaultPrimaryAuthor = {
        id: user.employeeId || user.id || "EMP_LOGGED_IN",
        employeeId: user.employeeId || user.id || "EMP_LOGGED_IN",
        name: user.name || "Faculty Member",
        department: user.department || "Computer Science & Engineering",
        designation: user.designation || "Faculty",
        institution: "MMDU",
        isMmdu: true,
        isPrimary: true,
        isDeletable: false,
      };

      if (handleInputChange) {
        handleInputChange({
          target: {
            name: "authors",
            value: [defaultPrimaryAuthor],
          },
        });
      }
    }
  }, [user, currentAuthors.length]);
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

  const validateAllFields = () => {
    // 1. Basic Title
    if (!formData.title || !formData.title.trim()) {
      setToastMessage(`Field Required: Please enter ${basicFields?.title || "Title"}.`);
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }

    // 2. Domain / Research Area
    if (!formData.domain || !formData.domain.trim()) {
      setToastMessage(`Field Required: Please enter ${basicFields?.domain || "Research Area / Domain"}.`);
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }

    // 3. Category / Subtype Dropdown Selection
    if (dropdownOptions && dropdownOptions.length > 0 && (!formData.dropdown || !formData.dropdown.trim())) {
      setToastMessage(`Field Required: Please select ${basicFields?.dropdown || "Category Type"}.`);
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }

    // 4. Authors validation
    if (!currentAuthors || currentAuthors.length === 0) {
      setToastMessage("Field Required: At least one author must be added.");
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }
    if (currentAuthors.length > 15) {
      setToastMessage("Limit Exceeded: Maximum 15 authors allowed per submission.");
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }
    const hasMmduAuthor = currentAuthors.some((a) => a.isMmdu !== false);
    if (!hasMmduAuthor) {
      setToastMessage("Field Required: At least one author must be an MMDU faculty/staff member.");
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }

    // 5. First Verification Detail
    if (!formData.firstVerification || !formData.firstVerification.trim()) {
      setToastMessage(`Field Required: Please enter ${verificationLabels?.first || "Verification Detail #1"}.`);
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }

    // 6. Second Verification Detail
    if (!formData.secondVerification || !formData.secondVerification.trim()) {
      setToastMessage(`Field Required: Please enter ${verificationLabels?.second || "Verification Detail #2"}.`);
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }

    // 7. Research Publication Specifics (Journal Name, Quartile, Impact Factor, Quartile Proof, Volume, Issue, Page No)
    if (category === "Publication" || showResearchSection) {
      if (!formData.journalName || !formData.journalName.trim()) {
        setToastMessage("Field Required: Please enter Name of Journal.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (!formData.quartile) {
        setToastMessage("Field Required: Please select Quartile (Q1, Q2, Q3, or Q4).");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (formData.impactFactor === undefined || formData.impactFactor === null || String(formData.impactFactor).trim() === "") {
        setToastMessage("Field Required: Please enter Impact Factor.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (!formData.quartileProof || !formData.quartileProof.trim()) {
        setToastMessage("Field Required: Please enter Quartile Proof (Scimago / SJR Link or Proof URL).");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (!formData.volumeNo || !formData.volumeNo.trim()) {
        setToastMessage("Field Required: Please enter Volume No.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (!formData.issueNo || !formData.issueNo.trim()) {
        setToastMessage("Field Required: Please enter Issue No.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (!formData.pageNo || !formData.pageNo.trim()) {
        setToastMessage("Field Required: Please enter Page No.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
    }

    // 8. Conference Specific Fields
    if (category === "Conference") {
      if (!formData.conferenceTitle || !formData.conferenceTitle.trim()) {
        setToastMessage("Field Required: Please enter Title of Conference / Seminar.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (!formData.organizedBy || !formData.organizedBy.trim()) {
        setToastMessage("Field Required: Please enter Organised By.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (!formData.startDate) {
        setToastMessage("Field Required: Please select Conference Start Date.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
      if (!formData.endDate) {
        setToastMessage("Field Required: Please select Conference End Date.");
        setTimeout(() => setToastMessage(null), 5000);
        return false;
      }
    }

    // 9. Self-Certification Checkbox
    if (!formData.certified) {
      setToastMessage("Field Required: Please check the self-certification box to confirm information accuracy.");
      setTimeout(() => setToastMessage(null), 5000);
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    if (!validateAllFields()) return;
    try {
      if (onSubmit) await onSubmit(e);
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to submit claim due to server error.";
      setToastMessage(errMsg);
      setTimeout(() => setToastMessage(null), 8000);
    }
  };

  const handleFormDraft = async (e) => {
    if (!validateAllFields()) return;
    try {
      if (onDraft) await onDraft(e);
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to save draft due to server error.";
      setToastMessage(errMsg);
      setTimeout(() => setToastMessage(null), 8000);
    }
  };

  const getDepartmentSuggestions = (deptVal) => {
    const val = String(deptVal || "").toLowerCase().trim();
    if (!val) return departments;
    return departments.filter((d) => String(d).toLowerCase().includes(val));
  };

  const getEmpIdSuggestions = (authorState) => {
    const dept = String(authorState?.department || "").toLowerCase().trim();
    const empId = String(authorState?.employeeId || authorState?.id || "").toLowerCase().trim();
    const name = String(authorState?.name || "").toLowerCase().trim();

    return dummyMembers.filter((m) => {
      const mDept = String(m.department || "").toLowerCase();
      const mId = String(m.id || "").toLowerCase();
      const mName = String(m.name || "").toLowerCase();

      const matchDept = !dept || mDept.includes(dept);
      const matchEmpId = !empId || mId.includes(empId);
      const matchName = !name || mName.includes(name);
      return matchDept && matchEmpId && matchName;
    });
  };

  const getNameSuggestions = (authorState) => {
    const dept = String(authorState?.department || "").toLowerCase().trim();
    const empId = String(authorState?.employeeId || authorState?.id || "").toLowerCase().trim();
    const name = String(authorState?.name || "").toLowerCase().trim();

    return dummyMembers.filter((m) => {
      const mDept = String(m.department || "").toLowerCase();
      const mId = String(m.id || "").toLowerCase();
      const mName = String(m.name || "").toLowerCase();

      const matchDept = !dept || mDept.includes(dept);
      const matchEmpId = !empId || mId.includes(empId);
      const matchName = !name || mName.includes(name);
      return matchDept && matchEmpId && matchName;
    });
  };

  const handleSelectFacultyToNewAuthor = (member) => {
    setNewAuthor({
      id: member.id,
      employeeId: member.id,
      name: member.name,
      department: member.department,
      designation: member.designation,
      institution: "MMDU",
      isMmdu: true,
      role: member.role || "faculty",
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

    if (editingIndex === null && currentAuthors.length >= 15) {
      setToastMessage("Maximum limit of 15 authors per submission reached.");
      setTimeout(() => setToastMessage(null), 5000);
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

    let updatedAuthors = [];
    if (editingIndex !== null) {
      updatedAuthors = [...currentAuthors];
      updatedAuthors[editingIndex] = authorObj;
      setEditingIndex(null);
    } else {
      const isDuplicate = currentAuthors.some(
        (a) => a.name.toLowerCase().trim() === authorObj.name.toLowerCase().trim()
      );

      if (isDuplicate) {
        setToastMessage(`Author "${authorObj.name}" is already added.`);
        setTimeout(() => setToastMessage(null), 4000);
        return;
      }
      updatedAuthors = [...currentAuthors, authorObj];
    }

    if (handleInputChange) {
      handleInputChange({
        target: {
          name: "authors",
          value: updatedAuthors,
        },
      });
    }

    if (handleAddAuthor) {
      handleAddAuthor(authorObj);
    }

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

    const isPrimaryAuthor =
      indexToRemove === 0 ||
      targetAuthor?.isPrimary ||
      targetAuthor?.isDeletable === false ||
      (user && (targetAuthor?.id === (user.employeeId || user.id) || targetAuthor?.employeeId === (user.employeeId || user.id)));

    if (isPrimaryAuthor) {
      setToastMessage("Primary applicant (logged-in faculty) cannot be deleted.");
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

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
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-rose-900/95 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-rose-700 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-300" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:bg-rose-800 p-1 rounded-lg transition-colors cursor-pointer"
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
            required
          />

          <Input
            label={basicFields.domain}
            name="domain"
            value={formData.domain || ""}
            onChange={handleInputChange}
            required
          />

          {dropdownOptions.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide flex items-center">
                {basicFields.dropdown} <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <select
                name="dropdown"
                value={formData.dropdown || ""}
                onChange={handleInputChange}
                required
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
                const isPrimaryAuthor =
                  index === 0 ||
                  author?.isPrimary ||
                  author?.isDeletable === false ||
                  (user && (author?.id === (user.employeeId || user.id) || author?.employeeId === (user.employeeId || user.id)));

                return (
                  <div
                    key={author.id || index}
                    className="bg-white border border-neutral-200/90 rounded-xl p-3.5 shadow-sm hover:border-neutral-300 transition-all flex flex-col justify-between relative group"
                  >
                    {/* Tile Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isPrimaryAuthor ? "bg-blue-700 text-white" : "bg-neutral-800 text-white"}`}>
                        {index === 0 ? "1st Author (Primary / You)" : `Author #${index + 1}`}
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

                        {isPrimaryAuthor ? (
                          <span
                            title="Primary applicant (logged-in faculty) cannot be deleted"
                            className="p-1 rounded-lg text-neutral-400 bg-neutral-100 flex items-center justify-center cursor-not-allowed"
                          >
                            <Lock size={13} />
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemoveAuthorIndex(index)}
                            title="Remove Author"
                            className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Information Tile Details */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-neutral-800 truncate">
                        {author.name || "Unnamed Author"}
                      </h4>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
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
                <Building2 size={13} /> From MMDU
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div className="relative">
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                  1. Department (MMDU)
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
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-neutral-100">
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

              {/* Author Name (Faculty / Student) */}
              <div className="relative">
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                  2. Author Name (Faculty / Student)
                </label>
                <input
                  type="text"
                  placeholder="Type or select Name..."
                  value={newAuthor.name || ""}
                  onFocus={() => setActiveDropdown({ field: "name" })}
                  onBlur={() => setTimeout(() => setActiveDropdown(null), 200)}
                  onChange={(e) => {
                    const typedName = e.target.value;
                    const matched = dummyMembers.find(
                      (m) => m.name.toLowerCase() === typedName.toLowerCase().trim()
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
                      getNameSuggestions(newAuthor).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onMouseDown={() => handleSelectFacultyToNewAuthor(m)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="text-xs font-bold text-neutral-800 block">
                              {m.name}
                            </span>
                            <span className="text-[11px] text-neutral-500">
                              {m.department} &bull; {m.designation}
                            </span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            m.role === 'student' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {m.role === 'student' ? 'Student' : 'Faculty'}
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
            {newAuthor.name && newAuthor.isMmdu ? (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Faculty verified: {newAuthor.name}
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
