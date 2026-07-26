import React from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { FileText, Download } from "lucide-react";

const mockReports = [
  {
    id: "RPT-RPC-01",
    name: "Monthly Verification Summary",
    date: "01 Aug 2024",
    type: "Verification",
    size: "1.2 MB",
  },
  {
    id: "RPT-RPC-02",
    name: "Pending Plagiarism Checks",
    date: "15 Jul 2024",
    type: "Compliance",
    size: "0.8 MB",
  },
];

const ResearchReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="RPC Reports"
        subtitle="Generate and download verification and compliance reports."
        icon={FileText}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Available Reports</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            Generate New Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">Report Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Generated On</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{report.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {report.type}
                    </span>
                  </td>
                  <td className="p-4">{report.date}</td>
                  <td className="p-4 text-gray-400">{report.size}</td>
                  <td className="p-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-100 transition-colors">
                      <Download size={14} />
                      Download
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

export default ResearchReports;
