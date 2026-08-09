import { useEffect } from "react";
import { motion } from "motion/react";
import { MascotSVG } from "../../components/common/MascotSVG";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="h-full min-h-full flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#F7F9F6]"
      style={{ background: "linear-gradient(160deg, #23351F 0%, #2e4429 50%, #172514 100%)" }}>
      {[120, 200, 280, 360].map((r, i) => (
        <motion.div key={i} className="absolute rounded-full border border-white/10"
          style={{ width: r, height: r }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 24 + i * 6, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#69A20D]"

          style={{ left: `${10 + (i * 7) % 80}%`, top: `${10 + (i * 11) % 80}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center gap-6 z-10">
        <MascotSVG size={120} animate />
        <div className="text-center">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white tracking-tight leading-tight font-display">
            Culture<br /><span className="text-[#CAE5B1]">Guide</span> AI
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-[#CAE5B1]/80 text-sm mt-2 font-semibold tracking-wide">Your Living UNESCO Heritage Guide</motion.p>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-20 flex flex-col items-center gap-3 z-10">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#69A20D]"
              animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
        <p className="text-white/60 text-xs font-medium tracking-wide">Powered by OpenCLIP AI</p>
      </motion.div>
    </div>
  );
}
