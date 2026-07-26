import React, { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { History, Search, Filter } from "lucide-react";
import StatusBadge from "../../../shared/components/StatusBadge";

const mockHistory = [
  {
    id: "PAY-5990",
    applicant: "Prof. Priya Singh",
    type: "Book Chapter",
    dateProcessed: "10 Jun 2024",
    amount: "₹ 10,000",
    status: "Completed",
    utr: "SBIN8291038291",
  },
  {
    id: "PAY-5840",
    applicant: "Dr. Amit Patel",
    type: "Project",
    dateProcessed: "15 May 2024",
    amount: "₹ 50,000",
    status: "Completed",
    utr: "HDFC0092817263",
  },
];

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = mockHistory.filter(
    (item) =>
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.utr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment History"
        subtitle="Log of all released research incentives."
        icon={History}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, Applicant, or UTR..."
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
                <th className="p-4 font-medium">Payment ID</th>
                <th className="p-4 font-medium">Applicant</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">UTR Number</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.dateProcessed}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">{item.applicant}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-500">{item.utr}</td>
                    <td className="p-4 text-right font-medium text-gray-900">{item.amount}</td>
                    <td className="p-4 text-right flex justify-end">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No payment history found.
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

export default PaymentHistory;
