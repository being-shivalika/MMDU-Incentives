import React from "react";

const LoadingSkeleton = ({ variant = "text", className = "", count = "1" }) => {
  const baseStyles = "bg-zinc-100 animate-pulse rounded";

  const variantStyles = {
    text: "h-4 w-full my-2",
    title: "h-6 w-1/3 my-3 rounded-md",
    avatar: "h-10 w-10 rounded-full",
    card: "h-32 w-full rounded-xl border border-zinc-100",
  };

  const iterations = Array.from({ length: parseInt(count, 10) });

  return (
    <>
      {iterations.map((_, idx) => (
        <div
          key={idx}
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        />
      ))}
    </>
  );
};

export default LoadingSkeleton;
