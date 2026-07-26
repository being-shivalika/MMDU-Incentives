import React, { useState } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { CreditCard, Search, Filter } from "lucide-react";
import ActionButton from "../../../shared/components/ActionButton";

const mockQueue = [
  {
    id: "PAY-6045",
    applicant: "Dr. Anjali Sharma",
    type: "Publication",
    title: "AI in Sustainable Agriculture",
    dateApproved: "18 Jul 2024",
    amount: "₹ 15,000",
    bankDetails: "HDFC Bank | **** 4589",
  },
  {
    id: "PAY-6046",
    applicant: "Prof. Rajesh Kumar",
    type: "Patent",
    title: "Smart Grid Load Balancing",
    dateApproved: "19 Jul 2024",
    amount: "₹ 20,000",
    bankDetails: "SBI | **** 1204",
  },
];

const PaymentQueue = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQueue = mockQueue.filter(
    (item) =>
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Queue"
        subtitle="Pending incentive disbursements awaiting accounts clearance."
        icon={CreditCard}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or Applicant..."
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
                <th className="p-4 font-medium">Submission Details</th>
                <th className="p-4 font-medium">Bank Details</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQueue.length > 0 ? (
                filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.id}</div>
                      <div className="text-xs text-gray-500 mt-1">App: {item.dateApproved}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">{item.applicant}</td>
                    <td className="p-4">
                      <div className="text-gray-900 truncate max-w-[200px]" title={item.title}>{item.title}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono text-gray-500">{item.bankDetails}</td>
                    <td className="p-4 text-right font-medium text-gray-900">{item.amount}</td>
                    <td className="p-4 text-right">
                      <ActionButton 
                        defaultText="Process" 
                        activeText="Processed" 
                        size="sm"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No pending payments in the queue.
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

export default PaymentQueue;
