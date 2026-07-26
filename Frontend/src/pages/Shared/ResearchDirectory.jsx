import React, { useState } from "react";
import PageHeader from "../../shared/components/PageHeader";
import { FolderSearch, Search, Filter, ChevronRight } from "lucide-react";
import StatusBadge from "../../shared/components/StatusBadge";

const mockResearchData = [
  {
    id: 1,
    title: "AI in Sustainable Agriculture",
    author: "Dr. Anjali Sharma",
    department: "Computer Science",
    type: "Publication",
    year: "2023",
    status: "Verified",
    journal: "IEEE Access",
  },
  {
    id: 2,
    title: "Smart Grid Load Balancing",
    author: "Dr. Rajesh Kumar",
    department: "Electrical Engineering",
    type: "Patent",
    year: "2023",
    status: "Pending Review",
    journal: "N/A",
  },
  {
    id: 3,
    title: "Machine Learning for Healthcare Diagnostics",
    author: "Prof. Priya Singh",
    department: "Biotechnology",
    type: "Book Chapter",
    year: "2022",
    status: "Verified",
    journal: "Springer",
  },
  {
    id: 4,
    title: "IoT Based Smart City Infrastructure",
    author: "Dr. Amit Patel",
    department: "Civil Engineering",
    type: "Project",
    year: "2024",
    status: "Ongoing",
    journal: "N/A",
  },
  {
    id: 5,
    title: "Blockchain for Supply Chain Security",
    author: "Dr. Neha Gupta",
    department: "Computer Science",
    type: "Publication",
    year: "2023",
    status: "Verified",
    journal: "ACM Computing Surveys",
  },
];

const ResearchDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = mockResearchData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Research Directory"
        subtitle="Browse and search university-wide research output."
        icon={FolderSearch}
      />

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by title, author, or department..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto">
            <option value="">All Departments</option>
            <option value="cs">Computer Science</option>
            <option value="ee">Electrical Engineering</option>
            <option value="mech">Mechanical Engineering</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto">
            <option value="">All Types</option>
            <option value="pub">Publication</option>
            <option value="pat">Patent</option>
            <option value="book">Book/Chapter</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">Title & Author</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Year</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.author}
                      </div>
                    </td>
                    <td className="p-4">{item.department}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4">{item.year}</td>
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors group">
                        <ChevronRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No research records found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filteredData.length} of {mockResearchData.length} results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchDirectory;
