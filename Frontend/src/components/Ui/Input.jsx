import React from "react";
import { motion } from "motion/react";
import FieldTooltip from "./FieldTooltip";

const Input = React.forwardRef(
  ({ label, tooltip, policyLink = "/policies", error, className = "", type = "text", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-0 text-left">
        {label && (
          <label className="text-xs font-semibold text-neutral-600 tracking-wide uppercase mb-1 flex items-center gap-1">
            <span>{label}</span>
            {props.required !== false && <span className="text-red-500 font-bold">*</span>}
            {tooltip && <FieldTooltip text={tooltip} policyLink={policyLink} />}
          </label>
        )}
        <motion.input
          ref={ref}
          type={type}
          whileFocus={{ scale: 1.002 }}
          transition={{ duration: 0.1 }}
          className={`w-full px-2 py-1.5 text-sm bg-white text-zinc-900 border rounded-md placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-zinc-200"
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-medium text-red-500 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
