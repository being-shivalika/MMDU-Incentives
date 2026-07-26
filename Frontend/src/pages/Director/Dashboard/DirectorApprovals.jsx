import React, { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { CheckCircle, Search, Filter, Download } from "lucide-react";
import StatusBadge from "../../../shared/components/StatusBadge";
import ActionButton from "../../../shared/components/ActionButton";

const mockApprovals = [
  {
    id: "DIR-4050",
    applicant: "Dr. Anjali Sharma",
    department: "Computer Science",
    type: "Publication",
    title: "AI in Sustainable Agriculture",
    date: "16 Jul 2024",
    status: "Pending Director",
    amount: "₹ 15,000",
  },
  {
    id: "DIR-4055",
    applicant: "Prof. Rajesh Kumar",
    department: "Electrical Engineering",
    type: "Patent",
    title: "Smart Grid Load Balancing",
    date: "17 Jul 2024",
    status: "Approved",
    amount: "₹ 20,000",
  },
];

const DirectorApprovals = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = mockApprovals.filter(
    (item) =>
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Director Approvals"
        subtitle="Final sign-off for research incentives across all departments."
        icon={CheckCircle}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, title, or dept..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors justify-center flex-1 sm:flex-none">
              <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors justify-center flex-1 sm:flex-none">
              <Download size={16} /> Export List
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">ID & Date</th>
                <th className="p-4 font-medium">Applicant & Dept</th>
                <th className="p-4 font-medium">Submission Title</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Incentive</th>
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
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.applicant}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.department}</div>
                    </td>
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
                      {item.status === "Approved" ? (
                        <StatusBadge status={item.status} />
                      ) : (
                        <ActionButton 
                          defaultText="Approve / Reject" 
                          activeText="Reviewed" 
                          size="sm"
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No pending director approvals.
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

export default DirectorApprovals;
