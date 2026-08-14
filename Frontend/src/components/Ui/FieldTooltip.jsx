import React, { useState } from "react";
import { Info, ExternalLink } from "lucide-react";

const FieldTooltip = ({ text, policyLink = "/policies", policyTitle = "View Policy PDF" }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1 z-20">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-neutral-400 hover:text-blue-600 focus:outline-none transition-colors p-0.5 rounded-full cursor-pointer"
        aria-label="Field Instructions"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {isVisible && (
        <div className="absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-1.5 w-60 sm:w-64 max-w-[85vw] p-2.5 bg-neutral-900/95 text-white rounded-lg shadow-xl z-50 pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150 border border-neutral-800">
          <p className="leading-snug font-normal text-neutral-300 text-[10px] break-words normal-case">{text}</p>
          {policyLink && (
            <div className="mt-2 pt-1.5 border-t border-neutral-800 flex items-center justify-between text-[9px] gap-2">
              <span className="text-neutral-400 font-normal normal-case shrink-0">MMDU Policy Guidance</span>
              <a
                href={policyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5 hover:underline shrink-0 normal-case"
              >
                {policyTitle} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          )}
          <div className="absolute top-full left-4 sm:left-1/2 sm:-translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
        </div>
      )}
    </div>
  );
};

export default FieldTooltip;
