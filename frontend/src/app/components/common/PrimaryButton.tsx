import React from "react";
import { motion } from "motion/react";

export function PrimaryButton({ label, onClick, full = false, icon }: { label: string; onClick?: () => void; full?: boolean; icon?: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`bg-[#23351F] text-white font-bold rounded-2xl py-3.5 px-6 text-sm shadow-[0_4px_16px_rgba(35,53,31,0.2)] hover:bg-[#1a2917] flex items-center justify-center gap-2 transition-all duration-200 ${full ? "w-full" : ""}`}
    >
      {icon}{label}
    </motion.button>
  );
}
