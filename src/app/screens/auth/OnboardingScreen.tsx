import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ONBOARDING } from "../../constants/onboarding";
import { Badge } from "../../components/common/Badge";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { GhostButton } from "../../components/common/GhostButton";

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const cur = ONBOARDING[step];
  return (
    <div className="h-full min-h-full flex-1 flex flex-col bg-[#F7F9F6]">
      <div className="relative flex-shrink-0">
        <div className="h-72 bg-[#EEF1F3] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img key={step} src={cur.img} alt={cur.title}
              className="w-full h-full object-cover"
              initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.35 }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F9F6] via-transparent to-transparent" />
        </div>
        <div className="absolute top-16 right-5">
          <button onClick={onDone} className="text-[#222E1C] text-xs font-bold bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E4E7EB] shadow-xs">Skip</button>
        </div>
      </div>
      <div className="flex-1 flex flex-col px-6 pt-2">
        <div className="flex gap-2 mb-6">
          {ONBOARDING.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${i === step ? "bg-[#23351F]" : "bg-[#EEF1F3]"}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>
            <Badge label={cur.badge} color="gold" />
            <h2 className="text-3xl font-black text-[#222E1C] mt-3 leading-tight font-display">{cur.title}</h2>
            <p className="text-[#5F6B5E] text-base leading-relaxed mt-3">{cur.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-auto pb-10 flex flex-col gap-3">
          <PrimaryButton label={step < 2 ? "Continue" : "Get Started"} full
            onClick={() => step < 2 ? setStep(s => s + 1) : onDone()} />
          {step > 0 && <GhostButton label="Back" full onClick={() => setStep(s => s - 1)} />}
        </div>
      </div>
    </div>
  );
}
