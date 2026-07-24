import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={isLoading ? null : onClose}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-[1px]"
            />

            {/* Alert Surface */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-md bg-white border border-zinc-100 rounded-xl shadow-lg p-6 z-10"
            >
              <h3 className="text-base font-semibold text-zinc-900 mb-2 tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
                {description}
              </p>

              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                  {cancelLabel}
                </Button>
                <Button
                  variant={variant === "danger" ? "primary" : variant}
                  className={
                    variant === "danger"
                      ? "bg-red-600 border-red-600 hover:bg-red-700 focus:ring-red-600"
                      : ""
                  }
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>,
          document.body,
        )}
    </AnimatePresence>
  );
};

export default Dialog;
