import React from "react";
import { Clock, RefreshCcw, CheckCircle, AlertTriangle, XCircle, Calendar, DollarSign } from "lucide-react";
import Card from "../../../../components/Ui/Card";

const ReviewStats = ({ stats }) => {
  const statItems = [
    {
      title: "Pending Analysis",
      value: stats.pendingAnalysis || 0,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200"
    },
    {
      title: "Under Review",
      value: stats.underReview || 0,
      icon: RefreshCcw,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      border: "border-indigo-200"
    },
    {
      title: "Ready for Accounts",
      value: stats.readyForAccounts || 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-200"
    },
    {
      title: "Returned",
      value: stats.returnedForClarification || 0,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-200"
    },
    {
      title: "Rejected",
      value: stats.rejected || 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
      border: "border-red-200"
    },
    {
      title: "Completed Today",
      value: stats.completedToday || 0,
      icon: Calendar,
      color: "text-teal-600",
      bg: "bg-teal-100",
      border: "border-teal-200"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((stat, idx) => (
          <Card key={idx} className={`p-4 border ${stat.border} shadow-sm hover:shadow transition-shadow flex flex-col items-center text-center`}>
            <div className={`p-3 rounded-full ${stat.bg} mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </Card>
        ))}
      </div>
      
      {/* Total Incentive Highlight */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <DollarSign className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800 uppercase tracking-wide">Total Incentive Value Recommended</p>
            <p className="text-gray-500 text-sm">Accumulated across all submissions ready for accounts.</p>
          </div>
        </div>
        <div className="text-3xl md:text-4xl font-extrabold text-green-700 tracking-tight">
          ₹{stats.totalIncentiveValue?.toLocaleString('en-IN') || 0}
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
