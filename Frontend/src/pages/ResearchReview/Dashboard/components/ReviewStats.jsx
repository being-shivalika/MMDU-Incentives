import React from "react";
import { Users, CheckCircle, XCircle, Send, FileText } from "lucide-react";
import Card from "../../../../components/Ui/Card";

const ReviewStats = ({ pendingCount, verifiedCount, returnedCount, forwardedCount }) => {
  const stats = [
    {
      title: "Pending Verification",
      value: pendingCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Verified",
      value: verifiedCount,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Returned / Rejected",
      value: returnedCount,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Forwarded to Accounts",
      value: forwardedCount,
      icon: Send,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${stat.bg}`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReviewStats;
