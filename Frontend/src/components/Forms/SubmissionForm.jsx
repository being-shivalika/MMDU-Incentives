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

  children,
}) => {
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  const [nameFilter, setNameFilter] = useState("");

  const [dropdown, setDropdown] = useState("");

  const filteredFaculty = dummyFaculty.filter((faculty) => {
    const search = nameFilter.toLowerCase();

    return (
      faculty.name.toLowerCase().includes(search) ||
      faculty.id.toLowerCase().includes(search) ||
      faculty.department.toLowerCase().includes(search)
    );
  });

  const addAuthor = (faculty) => {
    if (selectedAuthors.find((a) => a.id === faculty.id)) return;

    setSelectedAuthors([...selectedAuthors, faculty]);
  };

  const removeAuthor = (id) => {
    setSelectedAuthors(selectedAuthors.filter((a) => a.id !== id));
  };

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
          <Input label={basicFields.title} />

          <Input label={basicFields.domain} />

          {dropdownOptions.length > 0 && (
            <div>
              <label className="text-xs uppercase text-zinc-500">
                {basicFields.dropdown}
              </label>

              <select
                value={dropdown}
                onChange={(e) => setDropdown(e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              >
                <option>Select</option>

                {dropdownOptions.map((option) => (
                  <option key={option}>{option}</option>
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
                  addAuthor(faculty);
                  setNameFilter("");
                }}
                className="w-full p-3 text-left border-b"
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
          {selectedAuthors.map((author) => (
            <div key={author.id} className="border rounded-xl p-4 w-64">
              <button onClick={() => removeAuthor(author.id)}>×</button>

              <p className="font-medium">{author.name}</p>

              <p className="text-xs">{author.designation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFICATION LINKS */}

      <section className="border-t pt-8 space-y-5">
        <h2 className="text-lg font-semibold">Verification Links</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <Input label={verificationLabels.first} placeholder="https://..." />

          <Input label={verificationLabels.second} placeholder="https://..." />

          <Input label={verificationLabels.third} placeholder="https://..." />

          <Input label={verificationLabels.fourth} placeholder="https://..." />
        </div>
      </section>

      {/* PAGE SPECIFIC */}

      <section className="border-t pt-8">{children}</section>

      {/* ACTIONS */}

      <div className="border-t pt-8 flex justify-between">
        <Button variant="outline">Save Draft</Button>

        <div className="flex gap-3">
          <Button variant="secondary">Preview</Button>

          <Button variant="primary">Submit</Button>
        </div>
      </div>
    </Card>
  );
};

export default SubmissionForm;
