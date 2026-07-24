import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";
import { cn } from "../../utils/cn";

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  size = "md",
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const widths = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/45 backdrop-blur-[1px]"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative z-10 w-full h-full bg-white border-l border-brand-gray-200 shadow-2xl flex flex-col overflow-hidden",
              widths[size],
              className,
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-gray-200 px-6 py-4">
              <h2 className="text-base font-semibold text-brand-gray-900 m-0">
                {title}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-brand-gray-400 hover:text-brand-gray-900"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 text-sm text-brand-gray-600">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex justify-end gap-3 border-t border-brand-gray-200 bg-brand-gray-50 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
