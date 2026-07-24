import React from "react";
import { motion } from "framer-motion";

const Card = React.forwardRef(
  ({ children, className = "", hoverable = false, onClick, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        whileHover={
          hoverable || onClick
            ? {
                y: -2,
                boxShadow:
                  "0 12px 20px -10px rgba(0,0,0,0.04), 0 4px 6px -2px rgba(0,0,0,0.02)",
              }
            : {}
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`bg-white border border-zinc-100 rounded-xl p-6 ${
          onClick || hoverable ? "cursor-pointer hover:border-zinc-300" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

// Optional sub-components for clean structure mapping
export const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-base font-semibold text-zinc-900 tracking-tight ${className}`}
  >
    {children}
  </h3>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`text-sm text-zinc-600 ${className}`}>{children}</div>
);

export default Card;
