import React from "react";
import Card from "../../../../components/Ui/Card";

const StatsRow = ({
  mySubmissionsCount,
  pendingCount,
  approvedCount,
  returnedCount,
  totalReleasedIncentive,
  totalProcessingIncentive,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      <Card className="p-4 flex flex-col justify-between bg-neutral-50 border border-neutral-200 shadow-sm hover:shadow-md transition-all">
        <span className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-wider">
          Submissions
        </span>
        <span className="text-2xl font-extrabold text-black mt-2">
          {mySubmissionsCount}
        </span>
      </Card>
      <Card className="p-4 flex flex-col justify-between bg-blue-50/80 border border-blue-200 shadow-sm hover:shadow-md transition-all">
        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
          Pending Review
        </span>
        <span className="text-2xl font-extrabold text-blue-950 mt-2">
          {pendingCount}
        </span>
      </Card>
      <Card className="p-4 flex flex-col justify-between bg-indigo-50/80 border border-indigo-200 shadow-sm hover:shadow-md transition-all">
        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
          Approved
        </span>
        <span className="text-2xl font-extrabold text-indigo-950 mt-2">
          {approvedCount}
        </span>
      </Card>
      <Card className="p-4 flex flex-col justify-between bg-amber-50/90 border border-amber-200 shadow-sm hover:shadow-md transition-all">
        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
          Returned Action
        </span>
        <span className="text-2xl font-extrabold text-amber-900 mt-2">
          {returnedCount}
        </span>
      </Card>
      {/* Switched Position 1: Payment Pending */}
      <Card className="p-4 flex flex-col justify-between bg-amber-100/70 border border-amber-300 shadow-md hover:shadow-lg transition-all">
        <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider">
          Payment Pending
        </span>
        <span className="text-2xl font-extrabold text-amber-950 mt-2">
          ₹{totalProcessingIncentive?.toLocaleString("en-IN") || 0}
        </span>
      </Card>
      {/* Switched Position 2: Incentive Approved */}
      <Card className="p-4 flex flex-col justify-between bg-emerald-50/90 border border-emerald-300 shadow-md hover:shadow-lg transition-all">
        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
          Incentive Approved
        </span>
        <span className="text-2xl font-extrabold text-emerald-900 mt-2">
          ₹{totalReleasedIncentive?.toLocaleString("en-IN") || 0}
        </span>
      </Card>
    </div>
  );
};

export default StatsRow;
