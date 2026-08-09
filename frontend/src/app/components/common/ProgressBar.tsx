import { motion } from "motion/react";

export function ProgressBar({ value, color = "#69A20D" }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-[#EEF1F3] rounded-full overflow-hidden border border-[#E4E7EB]">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
