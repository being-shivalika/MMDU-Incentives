import React, { useState } from "react";
import { motion } from "framer-motion";

const Avatar = ({
  src,
  alt = "User Profile",
  initials = "U",
  size = "md",
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200/60 overflow-hidden select-none ${sizeClasses[size]} ${className}`}
    >
      {src && !hasError ? (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-semibold text-zinc-600 tracking-wider uppercase">
          {initials.slice(0, 2)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
