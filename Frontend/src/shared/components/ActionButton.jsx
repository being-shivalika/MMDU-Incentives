import React, { useState } from "react";
import { Check } from "lucide-react";

const ActionButton = ({ 
  defaultText, 
  activeText, 
  onClick, 
  className = "", 
  variant = "primary",
  icon: Icon,
  size = "md"
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    setClicked(true);
  };

  const getBaseClasses = () => {
    if (clicked) {
      return "bg-green-600 hover:bg-green-700 text-white cursor-default shadow-sm ring-2 ring-green-600 ring-offset-1";
    }
    
    if (className) return className;

    switch (variant) {
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700 shadow-sm";
      case "warning":
        return "bg-orange-500 text-white hover:bg-orange-600 shadow-sm";
      case "secondary":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
      case "primary":
      default:
        return "bg-[#8C0404] text-white hover:bg-[#6F0303] shadow-sm";
    }
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      onClick={handleClick}
      disabled={clicked}
      className={`transition-all duration-200 active:scale-95 rounded-lg font-medium flex items-center justify-center gap-2 ${sizeClasses[size]} ${getBaseClasses()}`}
    >
      {clicked ? <Check className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} /> : (Icon && <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />)}
      {clicked ? activeText : defaultText}
    </button>
  );
};

export default ActionButton;
