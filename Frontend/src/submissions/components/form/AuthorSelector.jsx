import React, { useState } from "react";
import { getInternalFaculty } from "../../../../services/mockData";
import { Search, X, Check, Award, AlertCircle } from "lucide-react";

export const AuthorSelector = ({ value = {}, onChange, error }) => {
  const facultyList = getInternalFaculty();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRole, setSearchRole] = useState("coAuthors"); // firstAuthor | correspondingAuthor | coAuthors
  const [showDropdown, setShowDropdown] = useState(false);

  const firstAuthor = value.firstAuthor || null;
  const correspondingAuthor = value.correspondingAuthor || null;
  const coAuthors = value.coAuthors || [];

  const handleSelect = (fac) => {
    const newVal = { ...value };
    if (searchRole === "firstAuthor") {
      newVal.firstAuthor = fac.employeeId;
    } else if (searchRole === "correspondingAuthor") {
      newVal.correspondingAuthor = fac.employeeId;
    } else {
      if (!coAuthors.includes(fac.employeeId)) {
        newVal.coAuthors = [...coAuthors, fac.employeeId];
      }
    }
    onChange(newVal);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const removeAuthor = (role, employeeId) => {
    const newVal = { ...value };
    if (role === "firstAuthor") {
      newVal.firstAuthor = null;
    } else if (role === "correspondingAuthor") {
      newVal.correspondingAuthor = null;
    } else if (role === "coAuthors") {
      newVal.coAuthors = coAuthors.filter((id) => id !== employeeId);
    }
    onChange(newVal);
  };

  const filteredFaculty = facultyList.filter((fac) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      fac.name.toLowerCase().includes(term) ||
      fac.employeeId.toLowerCase().includes(term) ||
      fac.department.toLowerCase().includes(term);

    // Don't show in options if already selected as first or corresponding or co-author
    const isSelected =
      firstAuthor === fac.employeeId ||
      correspondingAuthor === fac.employeeId ||
      coAuthors.includes(fac.employeeId);

    return matchesSearch && !isSelected;
  });

  const getFacultyDetails = (employeeId) => {
    return facultyList.find((f) => f.employeeId === employeeId) || { name: employeeId, employeeId, department: "" };
  };

  return (
    <div className="space-y-4 border border-brand-gray-200 p-4 rounded-md bg-brand-gray-50/20 text-left w-full">
      <div className="border-b border-brand-gray-100 pb-2 flex justify-between items-center">
        <label className="text-xs font-bold text-brand-gray-800 uppercase tracking-wider">
          2. Academic Authors & Contributors (Internal Directory Only)
        </label>
        <span className="text-[10px] text-red-500 font-semibold">* No manual typing allowed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Author Selection */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-brand-gray-500">First Author</span>
          {firstAuthor ? (
            <div className="flex items-center justify-between border border-brand-gray-200 bg-white p-2.5 rounded shadow-sm">
              <div className="text-xs">
                <p className="font-bold text-brand-gray-900">{getFacultyDetails(firstAuthor).name}</p>
                <p className="text-[9px] text-brand-gray-400 font-mono font-bold uppercase">{firstAuthor}</p>
              </div>
              <button type="button" onClick={() => removeAuthor("firstAuthor")} className="text-brand-gray-400 hover:text-black">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchRole("firstAuthor");
                setShowDropdown(true);
              }}
              className="w-full text-left text-xs text-brand-gray-400 border border-dashed border-brand-gray-300 rounded p-2.5 bg-white hover:bg-brand-gray-50 transition-colors"
            >
              + Assign First Author
            </button>
          )}
        </div>

        {/* Corresponding Author Selection */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-brand-gray-500">Corresponding Author</span>
          {correspondingAuthor ? (
            <div className="flex items-center justify-between border border-brand-gray-200 bg-white p-2.5 rounded shadow-sm">
              <div className="text-xs">
                <p className="font-bold text-brand-gray-900">{getFacultyDetails(correspondingAuthor).name}</p>
                <p className="text-[9px] text-brand-gray-400 font-mono font-bold uppercase">{correspondingAuthor}</p>
              </div>
              <button type="button" onClick={() => removeAuthor("correspondingAuthor")} className="text-brand-gray-400 hover:text-black">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearchRole("correspondingAuthor");
                setShowDropdown(true);
              }}
              className="w-full text-left text-xs text-brand-gray-400 border border-dashed border-brand-gray-300 rounded p-2.5 bg-white hover:bg-brand-gray-50 transition-colors"
            >
              + Assign Corresponding Author
            </button>
          )}
        </div>

        {/* Co-Authors List */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-brand-gray-500">Co-Authors</span>
          <div className="flex flex-wrap gap-1.5">
            {coAuthors.map((id) => (
              <div key={id} className="inline-flex items-center gap-1.5 bg-white border border-brand-gray-200 rounded px-2 py-1 text-xs shadow-sm">
                <div className="text-left leading-tight">
                  <span className="font-bold text-brand-gray-900 text-[10px] block">{getFacultyDetails(id).name}</span>
                  <span className="text-[8px] text-brand-gray-400 font-mono font-bold uppercase">{id}</span>
                </div>
                <button type="button" onClick={() => removeAuthor("coAuthors", id)} className="text-brand-gray-400 hover:text-black">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setSearchRole("coAuthors");
                setShowDropdown(true);
              }}
              className="border border-dashed border-brand-gray-300 rounded px-2.5 py-1 text-xs text-brand-gray-400 hover:bg-brand-gray-50 bg-white"
            >
              + Add Co-Author
            </button>
          </div>
        </div>
      </div>

      {/* Floating Selector Dropdown */}
      {showDropdown && (
        <div className="border border-brand-gray-200 bg-white p-3 rounded-md shadow-lg space-y-2.5 relative z-50">
          <div className="flex justify-between items-center border-b border-brand-gray-150 pb-2">
            <span className="text-xs font-bold text-brand-gray-700 uppercase">
              Assign to: <strong className="text-black">{searchRole === "coAuthors" ? "Co-Author" : searchRole === "firstAuthor" ? "First Author" : "Corresponding"}</strong>
            </span>
            <button type="button" onClick={() => setShowDropdown(false)} className="text-xs font-bold hover:underline">
              Close
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty name, ID, or department..."
              className="w-full h-9 border border-brand-gray-200 p-2.5 text-xs rounded focus:border-black"
              autoFocus
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-brand-gray-400" />
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-brand-gray-100 border border-brand-gray-150 rounded">
            {filteredFaculty.length === 0 ? (
              <p className="p-3 text-xs text-brand-gray-400 italic">No matching active faculty found.</p>
            ) : (
              filteredFaculty.map((fac) => (
                <div
                  key={fac.employeeId}
                  onClick={() => handleSelect(fac)}
                  className="p-2.5 text-xs hover:bg-brand-gray-50 cursor-pointer flex justify-between items-center"
                >
                  <div className="text-left">
                    <span className="font-bold text-brand-gray-900">{fac.name}</span>
                    <span className="text-[10px] text-brand-gray-400 ml-2 uppercase font-mono font-bold">
                      {fac.department}
                    </span>
                  </div>
                  <span className="text-[10px] bg-brand-gray-100 px-1.5 py-0.5 rounded text-brand-gray-500 font-mono font-bold">
                    {fac.employeeId}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {error && (
        <span className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </span>
      )}
    </div>
  );
};
