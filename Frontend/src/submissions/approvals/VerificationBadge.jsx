import React from "react";
import { CheckCircle2, XCircle, AlertCircle, Link } from "lucide-react";

export const VerificationBadge = ({ type, verified }) => {
  if (verified === true) {
    return (
      <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-xs font-semibold text-green-700 animate-in fade-in duration-200">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified ({type})
      </span>
    );
  }

  if (verified === false) {
    return (
      <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs font-semibold text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        Failed Verification
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-brand-gray-50 border border-brand-gray-200 px-2 py-0.5 rounded text-xs font-semibold text-brand-gray-600">
      <AlertCircle className="h-3.5 w-3.5" />
      Unverified Link
    </span>
  );
};
