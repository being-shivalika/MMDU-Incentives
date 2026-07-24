import React from "react";
import { motion } from "framer-motion";

const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      isLoading,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-900",
      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-transparent",
      outline:
        "bg-white text-zinc-700 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-900",
      ghost:
        "bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;
