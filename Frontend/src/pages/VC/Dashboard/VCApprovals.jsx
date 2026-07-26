import React, { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { CheckCircle, Search, Filter } from "lucide-react";
import ActionButton from "../../../shared/components/ActionButton";

const mockApprovals = [
  {
    id: "VC-9012",
    department: "Computer Science",
    type: "Patent Filing Grant",
    title: "AI in Sustainable Agriculture - Filing Fee",
    date: "20 Jul 2024",
    status: "Pending VC Approval",
    amount: "₹ 50,000",
  },
  {
    id: "VC-9015",
    department: "Biotechnology",
    type: "Research Equipment",
    title: "Advanced Centrifuge Setup",
    date: "22 Jul 2024",
    status: "Pending VC Approval",
    amount: "₹ 2,50,000",
  },
];

const VCApprovals = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = mockApprovals.filter(
    (item) =>
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Approvals"
        subtitle="Review and authorize high-value grants and institutional research requests."
        icon={CheckCircle}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search approvals..."
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
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Proposal / Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Grant Amount</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">{item.department}</td>
                    <td className="p-4 max-w-[200px] truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-900">{item.amount}</td>
                    <td className="p-4 text-right">
                      <ActionButton 
                        defaultText="Review Request" 
                        activeText="Reviewed" 
                        size="sm"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No pending requests for Vice Chancellor.
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

export default VCApprovals;
