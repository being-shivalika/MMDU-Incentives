import React from "react";
import { motion } from "framer-motion";

const Badge = ({ children, variant = "neutral", className = "", ...props }) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border transition-all duration-200";

  const variants = {
    // Structural System States
    neutral: "bg-zinc-50 text-zinc-600 border-zinc-200",
    primary: "bg-zinc-950 text-white border-zinc-950",

    // Workflow States (Pending HOD/Principal)
    warning: "bg-amber-50 text-amber-700 border-amber-200/60",

    // Success States (Approved/Paid)
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",

    // Danger States (Rejected)
    danger: "bg-red-50 text-red-700 border-red-200/60",

    // Informational States (Under Review at RPC/Finance)
    info: "bg-blue-50 text-blue-700 border-blue-200/60",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
