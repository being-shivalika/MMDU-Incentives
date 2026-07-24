import React from "react";
import { Card } from "../../../../components/ui/Card";

export const FormSection = ({ title, description, children }) => {
  return (
    <Card className="p-5 border border-brand-gray-200/80 bg-white/50 backdrop-blur-sm shadow-sm space-y-4">
      {title && (
        <div className="border-b border-brand-gray-100 pb-3 text-left">
          <h3 className="text-sm font-bold text-brand-gray-900 tracking-tight">{title}</h3>
          {description && <p className="text-xs text-brand-gray-400 mt-0.5">{description}</p>}
        </div>
      )}
      <div className="grid grid-cols-12 gap-4">
        {children}
      </div>
    </Card>
  );
};
