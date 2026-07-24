import { LayoutDashboard } from "lucide-react";

const RegistrarDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-red-800" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrar Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome to the Registrar portal</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
        <p className="mt-2 text-gray-600">
          Manage academic records, verify documents, and oversee registration processes.
        </p>
      </div>
    </div>
  );
};

export default RegistrarDashboard;
