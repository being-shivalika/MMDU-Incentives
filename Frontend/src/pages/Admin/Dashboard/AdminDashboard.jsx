import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import { getDashboardStats, getRecentSubmissions } from "../../../services/dashboardService";
import { Users, FileText, CheckCircle, UserPlus, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({ totalUsers: 0, totalClaims: 0, totalCompleted: 0 });
  const [recentClaims, setRecentClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsResponse, recentResponse] = await Promise.all([
          getDashboardStats(),
          getRecentSubmissions()
        ]);
        
        if (statsResponse?.data) {
          setStats(statsResponse.data);
        }
        
        if (recentResponse?.data) {
          setRecentClaims(recentResponse.data);
        }
      } catch (err) {
        console.error("Error loading admin dashboard:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome Admin, {user?.name || "Administrator"}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Universal Administrative Control over claims, users, and system metrics.</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/submissions"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <FileText size={16} /> All Submissions Overseer
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#8C0404] hover:bg-[#6F0303] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <UserPlus size={16} /> Manage Database Users
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center justify-between border border-neutral-200/80 rounded-2xl bg-white shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Total Database Users</p>
            <h3 className="text-3xl font-extrabold text-neutral-900">{isLoading ? "-" : stats.totalUsers || 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#8C0404]/10 border border-[#8C0404]/20 flex items-center justify-center text-[#8C0404]">
            <Users className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-6 flex items-center justify-between border border-neutral-200/80 rounded-2xl bg-white shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Total Submissions</p>
            <h3 className="text-3xl font-extrabold text-neutral-900">{isLoading ? "-" : stats.totalClaims || 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700">
            <FileText className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-6 flex items-center justify-between border border-neutral-200/80 rounded-2xl bg-white shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Completed & Disbursed</p>
            <h3 className="text-3xl font-extrabold text-neutral-900">{isLoading ? "-" : stats.totalCompleted || 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle className="h-6 w-6" />
          </div>
        </Card>
      </div>

      <Card className="p-6 border border-neutral-200/80 rounded-2xl bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Recent Portal Activity</h2>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center text-xs text-neutral-400">Loading recent activity...</div>
        ) : error ? (
          <div className="py-8 text-center text-xs text-rose-600 font-semibold">{error}</div>
        ) : recentClaims.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">No recent claims found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-bold uppercase text-neutral-500 tracking-wider">
                  <th className="p-3.5">Claim ID</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Applicant</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {recentClaims.map((claim) => (
                  <tr key={claim.id || claim._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3.5 font-bold text-neutral-900">{claim.claimNumber || "-"}</td>
                    <td className="p-3.5 text-neutral-800 font-semibold max-w-xs truncate">{claim.title || "-"}</td>
                    <td className="p-3.5 text-neutral-600">{claim.applicantName || "-"}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {claim.status || "-"}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-500 whitespace-nowrap">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
