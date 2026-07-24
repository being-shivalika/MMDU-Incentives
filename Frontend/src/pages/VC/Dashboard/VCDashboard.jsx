import { LayoutDashboard } from "lucide-react";

const VCDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-red-800" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vice Chancellor Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome to the VC portal</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
        <p className="mt-2 text-gray-600">
          Review institutional research metrics, final approvals, and strategic oversight.
        </p>
      </div>
    </div>
  );
};

export default VCDashboard;
