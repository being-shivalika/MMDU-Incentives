import React, { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Shield, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { getAuditLogs } from "../../../services/adminService";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAuditLogs({ limit: 50 });
      if (res?.data?.logs) {
        setLogs(res.data.logs);
      } else if (Array.isArray(res?.logs)) {
        setLogs(res.logs);
      } else if (Array.isArray(res?.data)) {
        setLogs(res.data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Error loading audit logs:", err);
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Database Audit Logs"
        subtitle="Monitor system activity, user management events, and security logs."
        icon={Shield}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
          <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <Clock size={16} className="text-neutral-500" /> System Action History
          </h3>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-bold tracking-wider border-b border-neutral-200 text-[11px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Performed</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Entity / Target</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">
                    Loading audit logs...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-rose-600 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400">
                    No system audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-4 text-[11px] font-mono text-neutral-500 whitespace-nowrap">
                      {new Date(log.createdAt || log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-neutral-900">{log.action || "-"}</td>
                    <td className="p-4">{log.performedByName || log.performedBy || log.user || "System"}</td>
                    <td className="p-4 text-neutral-600">{log.entity ? `${log.entity} (${log.entityId || ""})` : log.target || "-"}</td>
                    <td className="p-4 text-xs font-mono text-neutral-500">{log.ipAddress || "127.0.0.1"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
