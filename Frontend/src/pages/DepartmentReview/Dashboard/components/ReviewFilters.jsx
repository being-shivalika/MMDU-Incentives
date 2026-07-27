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
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      {/* Search */}

      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />

        <input
          className="w-full border rounded-lg pl-10 pr-4 py-2"
          placeholder="Search Claim No, Title or Applicant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category */}

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="border rounded-lg px-4 py-2 min-w-48"
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
        className="border rounded-lg px-4 py-2 min-w-55"
      >
        <option value="All">All Status</option>

        <option value="Pending HOD Review">Pending HOD Review</option>

        <option value="Pending Principal Review">
          Pending Principal Review
        </option>

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
