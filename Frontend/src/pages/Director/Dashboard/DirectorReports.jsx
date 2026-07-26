import React from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Building2, Download, FileText, BarChart2 } from "lucide-react";
import StatCard from "../../../shared/components/StatCard";

const mockReports = [
  {
    id: "REP-901",
    name: "Quarterly Research Output (Q1 2024)",
    date: "01 Apr 2024",
    type: "Performance",
    size: "2.4 MB",
  },
  {
    id: "REP-902",
    name: "Department-wise Incentive Distribution",
    date: "15 May 2024",
    type: "Financial",
    size: "1.8 MB",
  },
  {
    id: "REP-903",
    name: "Annual Patent Filings Summary 2023",
    date: "10 Jan 2024",
    type: "Intellectual Property",
    size: "3.1 MB",
  },
];

const DirectorReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Reports"
        subtitle="View and download comprehensive research and financial reports."
        icon={Building2}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Reports Generated"
          value="45"
          icon={FileText}
          trend="+12%"
          trendLabel="vs last year"
        />
        <StatCard
          title="Most Active Department"
          value="Computer Science"
          icon={BarChart2}
          trend="24%"
          trendLabel="of total output"
        />
        <StatCard
          title="Total Incentives Disbursed"
          value="₹ 14.5L"
          icon={Building2}
          trend="+5%"
          trendLabel="vs last quarter"
        />
      </div>

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

export default DirectorReports;
