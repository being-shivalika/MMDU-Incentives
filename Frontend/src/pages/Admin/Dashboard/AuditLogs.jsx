import React from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Shield, Clock, AlertTriangle } from "lucide-react";

const mockLogs = [
  { id: 1, action: "User Role Updated", user: "admin@mmdu.ac.in", target: "ravi.t@mmdu.ac.in", timestamp: "2024-07-26 14:32:01", severity: "medium" },
  { id: 2, action: "System Configuration Changed", user: "admin@mmdu.ac.in", target: "Incentive Policies", timestamp: "2024-07-26 10:15:45", severity: "high" },
  { id: 3, action: "Failed Login Attempt", user: "Unknown (IP: 192.168.1.5)", target: "System", timestamp: "2024-07-25 23:45:12", severity: "high" },
  { id: 4, action: "New Account Created", user: "admin@mmdu.ac.in", target: "new.faculty@mmdu.ac.in", timestamp: "2024-07-25 09:20:00", severity: "low" },
];

const AuditLogs = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="Monitor system activity and security events."
        icon={Shield}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-gray-500" /> Recent Activity
          </h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            Export Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900 border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Action performed</th>
                <th className="p-4 font-medium">Actor</th>
                <th className="p-4 font-medium">Target</th>
                <th className="p-4 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500">{log.timestamp}</td>
                  <td className="p-4 font-medium text-gray-900">{log.action}</td>
                  <td className="p-4">{log.user}</td>
                  <td className="p-4 text-gray-500">{log.target}</td>
                  <td className="p-4">
                    {log.severity === 'high' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700"><AlertTriangle size={12} /> High</span>}
                    {log.severity === 'medium' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">Medium</span>}
                    {log.severity === 'low' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">Low</span>}
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

export default AuditLogs;
