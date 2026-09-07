"use client";
import { motion } from "motion/react";

function Toggle({ value, onClick, disabled }: ToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="w-14 h-8 p-1 rounded-full flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      animate={{
        backgroundColor: value ? "#60a5fa" : "#a3a3a3",
        /* ? "var(--color-blue-400)"     // Disabled due to "not an animatable color" warning
           : "var(--color-neutral-400)", */
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      disabled={disabled}
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white"
        animate={{ x: value ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        whileTap={{ scale: 0.94 }}
      />
    </motion.button>
  );
}

interface ToggleProps {
  value: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default Toggle;
