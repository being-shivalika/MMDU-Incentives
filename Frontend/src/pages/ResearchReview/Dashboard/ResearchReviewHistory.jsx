import React, { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { History, Search, Filter } from "lucide-react";
import StatusBadge from "../../../shared/components/StatusBadge";

const mockHistory = [
  {
    id: "RPC-5012",
    applicant: "Dr. Anjali Sharma",
    department: "Computer Science",
    type: "Publication",
    title: "AI in Sustainable Agriculture",
    date: "10 Jul 2024",
    status: "Verified",
    remarks: "Scopus indexed, DOI verified. Forwarded.",
  },
  {
    id: "RPC-5018",
    applicant: "Prof. Rajesh Kumar",
    department: "Electrical Engineering",
    type: "Patent",
    title: "Smart Grid Load Balancing",
    date: "12 Jul 2024",
    status: "Rejected",
    remarks: "Patent application number invalid. Returned.",
  },
];

const ResearchReviewHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = mockHistory.filter(
    (item) =>
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification History"
        subtitle="Log of all verified and rejected research submissions by RPC."
        icon={History}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search history..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">ID & Date</th>
                <th className="p-4 font-medium">Applicant</th>
                <th className="p-4 font-medium">Submission Title</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.applicant}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.department}</div>
                    </td>
                    <td className="p-4 max-w-[200px] truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-4 max-w-[200px] truncate text-xs" title={item.remarks}>
                      {item.remarks}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No verification records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResearchReviewHistory;
