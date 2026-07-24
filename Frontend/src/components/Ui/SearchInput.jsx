import React from "react";
import { motion } from "framer-motion";

const SearchInput = React.forwardRef(
  (
    {
      className = "",
      value,
      onChange,
      placeholder = "Search claims, tokens or journals...",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <motion.input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          whileFocus={{ scale: 1.002 }}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2 text-sm bg-white text-zinc-900 border border-zinc-200 rounded-md placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all ${className}`}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
