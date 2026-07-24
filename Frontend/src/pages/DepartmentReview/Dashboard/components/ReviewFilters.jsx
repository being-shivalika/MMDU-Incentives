import React from "react";
import { Search } from "lucide-react";

const ReviewFilters = ({ searchTerm, setSearchTerm, filterType, setFilterType, filterStatus, setFilterStatus }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black sm:text-sm"
          placeholder="Search by ID or Applicant Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <select
        className="block w-full md:w-48 py-2 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-black focus:border-black sm:text-sm"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="All">All Types</option>
        <option value="Publication">Publication</option>
        <option value="Patent">Patent</option>
        <option value="Book">Book</option>
        <option value="Project">Project</option>
        <option value="Consultancy">Consultancy</option>
      </select>

      <select
        className="block w-full md:w-48 py-2 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-black focus:border-black sm:text-sm"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="All">All Statuses</option>
        <option value="pending_review">Pending Review</option>
        <option value="approved">Approved</option>
        <option value="returned">Returned</option>
        <option value="rejected">Rejected</option>
        <option value="forwarded">Forwarded</option>
      </select>
    </div>
  );
};

export default ReviewFilters;
