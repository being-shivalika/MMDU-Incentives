import React from "react";
import { motion } from "framer-motion";

const Tabs = ({ tabs = [], activeTab, onChange, className = "" }) => {
  return (
    <div
      className={`flex border-b border-zinc-100 space-x-6 bg-white ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative pb-3 text-sm font-medium tracking-wide transition-colors focus:outline-none ${
              isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-950"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
