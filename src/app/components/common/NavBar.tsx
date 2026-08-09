import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export function NavBar({ title, onBack, right }: { title?: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-5 pt-12 sm:pt-14 pb-3.5 flex items-center gap-3 border-b border-[#E4E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      {onBack && (
        <motion.button whileTap={{ scale: 0.94 }} onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center flex-shrink-0 hover:bg-[#EAF6DD] transition-colors text-[#222E1C] border border-[#E4E7EB]/50">
          <ArrowLeft size={18} />
        </motion.button>
      )}
      {title && <h1 className="flex-1 text-lg font-black text-[#222E1C] font-display truncate tracking-tight">{title}</h1>}
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}
