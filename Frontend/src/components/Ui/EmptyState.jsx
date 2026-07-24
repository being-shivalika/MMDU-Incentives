import React from "react";
import { motion } from "framer-motion";

const EmptyState = ({
  title = "No records found",
  description = "There are no active entries in this queue right now.",
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-zinc-200 rounded-xl bg-white max-w-md mx-auto my-6"
    >
      <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-zinc-400 max-w-xs leading-relaxed mb-5">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
