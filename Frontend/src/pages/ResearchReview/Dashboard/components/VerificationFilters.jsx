import React from "react";
import { Search } from "lucide-react";

const VerificationFilters = ({ searchTerm, setSearchTerm, filterType, setFilterType, filterStatus, setFilterStatus }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by ID or applicant name..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-4">
        <select 
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
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
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="pending_verification">Pending</option>
          <option value="verified">Verified</option>
          <option value="returned">Returned</option>
          <option value="rejected">Rejected</option>
          <option value="forwarded_accounts">Forwarded</option>
        </select>
      </div>
    </div>
  );
};

export default VerificationFilters;
