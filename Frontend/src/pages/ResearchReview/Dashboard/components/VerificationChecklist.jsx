import React, { useState } from "react";
import { CheckSquare, Square } from "lucide-react";

const VerificationChecklist = ({ submissionType }) => {
  const getDefaultChecklist = (type) => {
    const common = [
      { id: "applicant", label: "Applicant details verified", checked: false },
      { id: "dept", label: "Department approval verified", checked: false },
    ];

    if (type === "Publication") {
      return [
        ...common,
        { id: "pub1", label: "Journal indexing verified (SCI/Scopus)", checked: false },
        { id: "pub2", label: "Impact factor verified", checked: false },
        { id: "pub3", label: "Applicant affiliation is correct", checked: false },
      ];
    }
    if (type === "Patent") {
      return [
        ...common,
        { id: "pat1", label: "Patent application number verified", checked: false },
        { id: "pat2", label: "Patent status confirmed", checked: false },
      ];
    }
    
    return [
      ...common,
      { id: "gen1", label: "Supporting documents verified", checked: false },
    ];
  };

  const [checklist, setChecklist] = useState(getDefaultChecklist(submissionType));

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="space-y-3">
      {checklist.map((item) => (
        <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
          <div onClick={() => toggleCheck(item.id)}>
            {item.checked ? (
              <CheckSquare className="h-5 w-5 text-black" />
            ) : (
              <Square className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </div>
          <span className={`text-sm select-none ${item.checked ? "text-gray-900 font-medium" : "text-gray-600"}`}>
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default VerificationChecklist;
