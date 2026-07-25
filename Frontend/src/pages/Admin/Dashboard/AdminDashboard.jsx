import React, { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import { getDashboardStats, getRecentSubmissions } from "../../../services/dashboardService";
import { Users, FileText, CheckCircle } from "lucide-react";

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
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome Admin, {user?.name || "Administrator"}
        </h1>
        <p className="text-gray-500 mt-1">Manage users, view system metrics and oversee all operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
            <h3 className="text-3xl font-bold text-gray-900">{isLoading ? "-" : stats.totalUsers || 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Claims</p>
            <h3 className="text-3xl font-bold text-gray-900">{isLoading ? "-" : stats.totalClaims || 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
        </Card>

        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Completed Claims</p>
            <h3 className="text-3xl font-bold text-gray-900">{isLoading ? "-" : stats.totalCompleted || 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading recent activity...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : recentClaims.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No recent claims found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-sm font-medium text-gray-600">
                  <th className="p-4">Claim ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim.id || claim._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{claim.claimNumber || "-"}</td>
                    <td className="p-4 text-gray-600">{claim.title || "-"}</td>
                    <td className="p-4 text-gray-600">{claim.applicantName || "-"}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {claim.status || "-"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
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
