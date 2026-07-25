import React, { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import Card from "../../../components/Ui/Card";
import { getRecentSubmissions } from "../../../services/dashboardService";

const VCDashboard = () => {
  const { user } = useAuth();
  
  const [recentClaims, setRecentClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const recentResponse = await getRecentSubmissions();
        
        if (recentResponse?.data) {
          setRecentClaims(recentResponse.data);
        }
      } catch (err) {
        console.error("Error loading VC dashboard:", err);
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
          Welcome Vice Chancellor, {user?.name || "Dr. Anderson"}
        </h1>
        <p className="text-gray-500 mt-1">Review institutional research metrics, final approvals, and strategic oversight.</p>
      </div>

      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Institutional Activity</h2>
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

export default VCDashboard;
