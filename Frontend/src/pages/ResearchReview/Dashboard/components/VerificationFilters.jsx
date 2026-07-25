import React from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const VerificationFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="searchTerm"
            placeholder="Search by Submission ID, Applicant Name, or Title..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={filters.searchTerm}
            onChange={handleChange}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors shadow-sm">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Advanced</span>
        </button>
      </div>

      {/* Advanced Filters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
          <select 
            name="department"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filters.department}
            onChange={handleChange}
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Research Type</label>
          <select 
            name="researchType"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filters.researchType}
            onChange={handleChange}
          >
            <option value="All">All Types</option>
            <option value="Publication">Publication</option>
            <option value="Patent">Patent</option>
            <option value="Book">Book</option>
            <option value="Project">Project</option>
            <option value="Consultancy">Consultancy</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Quartile</label>
          <select 
            name="quartile"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filters.quartile}
            onChange={handleChange}
          >
            <option value="All">All Quartiles</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
            <option value="Unranked">Unranked</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Publication Year</label>
          <select 
            name="year"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filters.year}
            onChange={handleChange}
          >
            <option value="All">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
          <select 
            name="status"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved / Ready</option>
            <option value="Revision Requested">Returned</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VerificationFilters;
