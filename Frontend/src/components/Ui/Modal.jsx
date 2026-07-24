import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-[2px]"
            />

            {/* Modal Sheet Container */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full max-w-2xl bg-white border border-zinc-100 rounded-xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh] ${className}`}
            >
              {/* Header Context */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable View Area */}
              <div className="p-6 overflow-y-auto flex-1 text-sm text-zinc-600 bg-white">
                {children}
              </div>
            </motion.div>
          </div>,
          document.body,
        )}
    </AnimatePresence>
  );
};

export default Modal;
