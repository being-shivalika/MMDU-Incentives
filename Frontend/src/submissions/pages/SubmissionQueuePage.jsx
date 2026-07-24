import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSubmissionQueue } from "../hooks/useSubmissionQueue";
import { SubmissionTable } from "../components/queue/SubmissionTable";
import { QueueFilterBar } from "../components/queue/QueueFilterBar";
import { useAuth } from "../../../contexts/AuthContext";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const SubmissionQueuePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "";

  const [filters, setFilters] = useState({
    typeId: null,
    status: initialStatus || null,
    search: ""
  });

  // Calculate default filters based on user role queue rules
  const getRoleFilters = () => {
    const defaultParams = {};
    if (user?.role === "faculty" || user?.role === "student") {
      defaultParams.creatorId = user.id;
    } else if (user?.role === "hod") {
      defaultParams.department = user.department;
      // Default show pending reviews
      if (!filters.status) {
        defaultParams.status = "DEPARTMENT_REVIEW";
      }
    } else if (user?.role === "principal") {
      if (!filters.status) {
        defaultParams.status = "PRINCIPAL_REVIEW";
      }
    } else if (user?.role === "rpc") {
      if (!filters.status) {
        defaultParams.status = ["FACULTY_VERIFICATION", "RPC_REVIEW"];
      }
    } else if (user?.role === "accounts") {
      if (!filters.status) {
        defaultParams.status = "FINANCE";
      }
    }
    return defaultParams;
  };

  const activeFilters = {
    ...filters,
    ...getRoleFilters()
  };

  const { submissions, loading, refresh } = useSubmissionQueue(activeFilters);

  // Perform client side search filtering if needed
  const searchedSubmissions = submissions.filter((sub) => {
    if (!filters.search) return true;
    const lower = filters.search.toLowerCase();
    return (
      sub.id.toLowerCase().includes(lower) ||
      sub.title.toLowerCase().includes(lower) ||
      sub.creatorName.toLowerCase().includes(lower)
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-gray-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-brand-gray-900 flex items-center gap-2">
            <ClipboardList className="h-5.5 w-5.5 text-brand-blue-500" />
            Research Submissions & Claim Queues
          </h1>
          <p className="text-xs text-brand-gray-400">
            View, track, and evaluate research claims flowing through the standardized verification state machine.
          </p>
        </div>

        {(user?.role === "faculty" || user?.role === "student") && (
          <Button
            onClick={() => navigate("/submissions/submit")}
            className="text-xs flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-brand-gray-800 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Research Submission
          </Button>
        )}
      </div>

      {/* Filter Options */}
      <QueueFilterBar filters={filters} onFilterChange={setFilters} />

      {/* Results Table */}
      <SubmissionTable submissions={searchedSubmissions} loading={loading} />
    </div>
  );
};
