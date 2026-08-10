import React from "react";
import Button from "../../../../components/Ui/Button";
import { PlusCircle } from "lucide-react";

const WelcomeHero = ({
  userName,
  userDesignation,
  userDepartment,
  onNewClaim,
}) => {
  return (
    <div className="bg-white border border-neutral-200 text-neutral-950 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950 m-0">
          Welcome back, {userName || "Faculty"}
        </h1>
        <p className="text-xs text-neutral-500 font-medium tracking-wide">
          {userDesignation || "Faculty Member"} &bull;{" "}
          {userDepartment || "Maharishi Markandeshwar University"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onNewClaim}
          className="bg-neutral-950 text-white hover:bg-neutral-900 border border-neutral-950 flex items-center gap-2 px-4 h-11 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          New Research Claim
        </Button>
      </div>
    </div>
  );
};

export default WelcomeHero;
