import React from "react";
import { Filter, Search } from "lucide-react";
import { SUBMISSION_CATEGORIES } from "../../config/submissionCategories";

export const QueueFilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white border border-brand-gray-200 p-4 rounded-md shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
      {/* Category Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-brand-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Filter className="h-3 w-3" />
          Submission Category
        </label>
        <select
          value={filters.typeId || ""}
          onChange={(e) => onFilterChange({ ...filters, typeId: e.target.value || null })}
          className="h-10 px-3 w-full bg-white border border-brand-gray-200 rounded-md text-sm text-brand-gray-900 focus:border-black"
        >
          <option value="">All Categories</option>
          {SUBMISSION_CATEGORIES.map((cat) => (
            <optgroup key={cat.id} label={cat.label}>
              {cat.types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Lifecycle Stage / Status */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-brand-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Filter className="h-3 w-3" />
          Lifecycle Stage
        </label>
        <select
          value={filters.status || ""}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value || null })}
          className="h-10 px-3 w-full bg-white border border-brand-gray-200 rounded-md text-sm text-brand-gray-900 focus:border-black"
        >
          <option value="">All States</option>
          <option value="DRAFT">Draft</option>
          <option value="DEPARTMENT_REVIEW">Department Review (HOD)</option>
          <option value="FACULTY_VERIFICATION">Faculty Verification</option>
          <option value="PRINCIPAL_REVIEW">Principal Review</option>
          <option value="RPC_REVIEW">RPC Incentive Review</option>
          <option value="FINANCE">Finance & Accounts</option>
          <option value="COMPLETED">Completed</option>
          <option value="RETURNED">Returned</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Text search filter (e.g. Title or Author) */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-brand-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Search className="h-3 w-3" />
          Search Details
        </label>
        <input
          type="text"
          placeholder="Search Title or ID..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="h-10 px-3 w-full bg-white border border-brand-gray-200 rounded-md text-sm text-brand-gray-900 focus:border-black placeholder:text-brand-gray-400"
        />
      </div>
    </div>
  );
};
