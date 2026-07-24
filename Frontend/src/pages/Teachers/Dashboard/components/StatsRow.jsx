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
      <Card className="p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold text-brand-gray-400 uppercase">
          Submissions
        </span>
        <span className="text-2xl font-bold text-black mt-2">
          {mySubmissionsCount}
        </span>
      </Card>
      <Card className="p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold text-brand-gray-400 uppercase">
          Pending Review
        </span>
        <span className="text-2xl font-bold text-black mt-2">
          {pendingCount}
        </span>
      </Card>
      <Card className="p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold text-brand-gray-400 uppercase">
          Approved
        </span>
        <span className="text-2xl font-bold text-black mt-2">
          {approvedCount}
        </span>
      </Card>
      <Card className="p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold text-brand-gray-400 uppercase">
          Returned Action
        </span>
        <span className="text-2xl font-bold text-amber-600 mt-2">
          {returnedCount}
        </span>
      </Card>
      <Card className="p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold text-brand-gray-400 uppercase">
          Incentive Released
        </span>
        <span className="text-2xl font-bold text-emerald-800 mt-2">
          ${totalReleasedIncentive}
        </span>
      </Card>
      <Card className="p-4 flex flex-col justify-between">
        <span className="text-[10px] font-bold text-brand-gray-400 uppercase">
          Payment Pending
        </span>
        <span className="text-2xl font-bold text-brand-gray-600 mt-2">
          ${totalProcessingIncentive}
        </span>
      </Card>
    </div>
  );
};

export default StatsRow;
