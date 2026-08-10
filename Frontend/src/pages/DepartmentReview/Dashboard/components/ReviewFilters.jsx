import React from "react";
import { Search } from "lucide-react";

const ReviewFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4"
        />
        <input
          className="w-full bg-white border border-neutral-200/80 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
          placeholder="Search Claim #, Title or Applicant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category */}
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="w-full sm:w-auto bg-white border border-neutral-200/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs cursor-pointer"
      >
        <option value="All">All Categories</option>
        <option value="Publication">Publication</option>
        <option value="Patent">Patent</option>
        <option value="Book">Book</option>
        <option value="Project">Project</option>
        <option value="Consultancy">Consultancy</option>
        <option value="Award">Award</option>
      </select>

      {/* Status */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="w-full sm:w-auto bg-white border border-neutral-200/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs cursor-pointer"
      >
        <option value="All">All Status</option>
        <option value="Pending HOD Review">Pending HOD Review</option>
        <option value="Pending Principal Review">Pending Principal Review</option>
        <option value="Pending Director Review">Pending Director Review</option>
        <option value="Pending RPC Review">Pending RPC Review</option>
        <option value="Pending Accounts Review">Pending Accounts Review</option>
        <option value="Approved">Approved</option>
        <option value="Revision Requested">Revision Requested</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  );
};

export default ReviewFilters;
