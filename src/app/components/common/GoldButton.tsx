import { motion } from "motion/react";

export function GoldButton({ label, onClick, full = false }: { label: string; onClick?: () => void; full?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`bg-[#69A20D] text-white font-bold rounded-2xl py-3.5 px-6 text-sm shadow-[0_4px_16px_rgba(105,162,13,0.25)] hover:bg-[#58890a] transition-all duration-200 ${full ? "w-full" : ""}`}
    >
      {label}
    </motion.button>
  );
}
