import { motion } from "motion/react";

export function GhostButton({ label, onClick, full = false }: { label: string; onClick?: () => void; full?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`bg-white text-[#23351F] border border-[#CAE5B1] font-bold rounded-2xl py-3.5 px-6 text-sm hover:bg-[#EAF6DD] transition-all duration-200 shadow-xs ${full ? "w-full" : ""}`}
    >
      {label}
    </motion.button>
  );
}
