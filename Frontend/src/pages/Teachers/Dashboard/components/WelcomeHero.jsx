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
    <div className="bg-white text-black p-6 rounded-lg  shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl md:text-2xl font-bold m-0 text-blaxk">
          Welcome back, {userName}
        </h1>
        <p className="text-xs text-brand-gray-400 mt-1.5 font-medium">
          {userDesignation} &bull; {userDepartment}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onNewClaim}
          className="bg-white text-black border-white hover:bg-brand-gray-100 flex items-center gap-1.5 h-10 text-xs font-bold"
        >
          <PlusCircle className="h-4 w-4" />
          New Research Claim
        </Button>
      </div>
    </div>
  );
};
export default WelcomeHero;
