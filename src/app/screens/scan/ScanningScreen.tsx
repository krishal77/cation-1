import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { recognizeSite as apiRecognizeSite, type RecognitionResult } from "../../services/api";
import { MascotSVG } from "../../components/common/MascotSVG";

export function ScanningScreen({ onDone, imageFile, onRecognitionResult }: { onDone: () => void; imageFile: File | null; onRecognitionResult: (result: RecognitionResult | null, error?: string) => void }) {
  const [progress, setProgress] = useState(0);
  const steps = ["Uploading image...", "Analyzing architecture...", "Cross-referencing heritage database...", "Generating insights..."];
  const [stepIdx, setStepIdx] = useState(0);
  const recognitionStarted = useRef(false);

  useEffect(() => {
    if (!imageFile || recognitionStarted.current) return;
    recognitionStarted.current = true;

    apiRecognizeSite(imageFile)
      .then(result => {
        onRecognitionResult(result);
      })
      .catch(err => {
        onRecognitionResult(null, err.message || 'Recognition failed');
      });
  }, [imageFile, onRecognitionResult]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onDone, 400); return 100; }
        return p + 2;
      });
      setStepIdx(Math.floor((progress / 100) * steps.length));
    }, 50);
    return () => clearInterval(interval);
  }, [onDone, progress]);

  return (
    <div className="h-full min-h-full flex-1 flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #23351F 0%, #2e4429 60%, #172514 100%)" }}>
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full border border-[#69A20D]/20"
          style={{ width: 100 + i * 60, height: 100 + i * 60 }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8">
        <div className="relative">
          <motion.div className="absolute inset-0 bg-[#69A20D]/30 blur-2xl rounded-full"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          <MascotSVG size={100} animate />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-2 font-display">Ara is analyzing...</h2>
          <motion.p key={stepIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-white/80 text-sm font-medium">{steps[Math.min(stepIdx, steps.length - 1)]}</motion.p>
        </div>
        <div className="w-full">
          <div className="flex justify-between mb-2">
            <span className="text-white/70 text-xs">AI Vision Processing</span>
            <span className="text-[#CAE5B1] text-xs font-black">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/15">
            <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #69A20D, #CAE5B1)", width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex gap-6">
          {["UNESCO DB", "OpenCLIP AI", "Stories Engine"].map((db, i) => (
            <div key={db} className="flex flex-col items-center gap-1">
              <motion.div className={`w-8 h-8 rounded-full flex items-center justify-center ${progress > (i + 1) * 30 ? "bg-[#69A20D]" : "bg-white/10"}`}
                animate={progress > (i + 1) * 30 ? { scale: [1, 1.2, 1] } : {}}>
                <Check size={14} className="text-white" />
              </motion.div>
              <span className="text-white/60 text-[9px] font-semibold text-center">{db}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
