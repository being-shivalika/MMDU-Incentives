import React, { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { CheckCircle, Search, Filter } from "lucide-react";
import StatusBadge from "../../../shared/components/StatusBadge";
import ActionButton from "../../../shared/components/ActionButton";

const mockVerifications = [
  {
    id: "VER-8092",
    faculty: "Dr. Anjali Sharma",
    type: "Employment Verification",
    requestedDate: "15 Jul 2024",
    status: "Pending",
  },
  {
    id: "VER-8095",
    faculty: "Prof. Priya Singh",
    type: "Research Affiliation",
    requestedDate: "12 Jul 2024",
    status: "Verified",
  },
];

const RegistrarVerifications = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVerifications = mockVerifications.filter(
    (item) =>
      item.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verifications"
        subtitle="Manage academic and employment verification requests."
        icon={CheckCircle}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search verifications..."
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
                <th className="p-4 font-medium">Request ID</th>
                <th className="p-4 font-medium">Faculty Name</th>
                <th className="p-4 font-medium">Verification Type</th>
                <th className="p-4 font-medium">Requested On</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVerifications.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500">{item.id}</td>
                  <td className="p-4 font-medium text-gray-900">{item.faculty}</td>
                  <td className="p-4">{item.type}</td>
                  <td className="p-4">{item.requestedDate}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'Pending' ? (
                      <ActionButton 
                        defaultText="Review" 
                        activeText="Verified" 
                        size="sm"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Completed</span>
                    )}
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

export default RegistrarVerifications;
