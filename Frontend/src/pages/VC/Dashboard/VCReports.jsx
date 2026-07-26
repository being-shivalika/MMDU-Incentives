import React from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Building2, Download, FileText, TrendingUp, Award } from "lucide-react";
import StatCard from "../../../shared/components/StatCard";

const mockReports = [
  { id: "VC-RPT-1", name: "Annual Research Excellence Report 2023-24", date: "01 Jul 2024", type: "Annual Review", size: "5.2 MB" },
  { id: "VC-RPT-2", name: "University Ranking Parameters Analysis", date: "15 Jun 2024", type: "Accreditation", size: "3.8 MB" },
  { id: "VC-RPT-3", name: "R&D Budget Allocation vs Utilization", date: "01 Apr 2024", type: "Financial", size: "2.1 MB" },
];

const VCReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Reports"
        subtitle="High-level strategic reports for university advancement and accreditation."
        icon={Building2}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Overall NAAC Score Target" value="A++" icon={Award} trend="On Track" trendLabel="Based on current R&D" />
        <StatCard title="Total Grants Received" value="₹ 4.5 Cr" icon={TrendingUp} trend="+18%" trendLabel="vs last year" />
        <StatCard title="University H-Index" value="45" icon={FileText} trend="+5" trendLabel="vs last year" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Strategic Reports</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">Report Title</th>
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
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
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

export default VCReports;
