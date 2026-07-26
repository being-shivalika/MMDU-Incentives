import React, { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { FolderSearch, Search, Filter, ExternalLink } from "lucide-react";

const mockRecords = [
  { id: "REC-7010", faculty: "Dr. Anjali Sharma", department: "Computer Science", year: "2024", submissions: 12, approved: 10, totalIncentives: "₹ 1,50,000" },
  { id: "REC-7011", faculty: "Prof. Rajesh Kumar", department: "Electrical Engineering", year: "2024", submissions: 8, approved: 5, totalIncentives: "₹ 75,000" },
  { id: "REC-7012", faculty: "Dr. Amit Patel", department: "Civil Engineering", year: "2024", submissions: 4, approved: 4, totalIncentives: "₹ 2,00,000" },
];

const RegistrarRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = mockRecords.filter(
    (item) =>
      item.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Records"
        subtitle="View consolidated research records and academic output of faculty."
        icon={FolderSearch}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search faculty or department..."
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
                <th className="p-4 font-medium">Record ID</th>
                <th className="p-4 font-medium">Faculty Name</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Submissions (YTD)</th>
                <th className="p-4 font-medium">Approved</th>
                <th className="p-4 font-medium">Total Incentives</th>
                <th className="p-4 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500">{item.id}</td>
                  <td className="p-4 font-medium text-gray-900">{item.faculty}</td>
                  <td className="p-4">{item.department}</td>
                  <td className="p-4">{item.submissions}</td>
                  <td className="p-4 text-green-600 font-medium">{item.approved}</td>
                  <td className="p-4 font-medium text-gray-900">{item.totalIncentives}</td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="View Full Record">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrarRecords;
