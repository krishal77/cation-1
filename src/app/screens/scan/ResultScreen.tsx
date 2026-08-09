import { motion } from "motion/react";
import {
  ArrowLeft, Share2, Check, MapPin, Volume2, AlertTriangle, RotateCcw,
  BookOpen, Compass, Navigation
} from "lucide-react";
import type { RecognitionResult } from "../../services/api";
import type { Screen } from "../../types/screen";
import { getSiteImage } from "../../constants/siteImages";
import { MascotSVG } from "../../components/common/MascotSVG";
import { NavBar } from "../../components/common/NavBar";
import { Badge } from "../../components/common/Badge";
import { ProgressBar } from "../../components/common/ProgressBar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { GhostButton } from "../../components/common/GhostButton";

export function ResultScreen({ onNav, onBack, recognitionResult, recognitionError, onSelectSite }: { onNav: (s: Screen) => void; onBack: () => void; recognitionResult: RecognitionResult | null; recognitionError?: string; onSelectSite: (name: string) => void }) {
  const siteName = recognitionResult?.siteName || "Unknown Site";
  const confidence = recognitionResult?.confidence || 0;
  const isConfident = recognitionResult?.isConfident ?? false;
  const metadata = recognitionResult?.metadata;
  const description = metadata?.description || `Explore the rich cultural history of ${siteName}.`;
  const location = metadata?.location || "Nepal";
  const confidencePercent = (confidence * 100).toFixed(1);

  if (recognitionError) {
    return (
      <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
        <NavBar title="Recognition" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-5 border border-red-200">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-[#222E1C] text-xl font-black mb-2 font-display">Recognition Failed</h2>
          <p className="text-[#5F6B5E] text-sm leading-relaxed mb-6">{recognitionError}</p>
          <PrimaryButton label="Try Again" full icon={<RotateCcw size={14} />} onClick={onBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <div className="relative h-64 bg-[#EEF1F3] flex-shrink-0">
        <img src={getSiteImage(siteName)}
          alt={siteName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F9F6] via-black/10 to-black/40" />
        <button onClick={onBack} className="absolute top-14 left-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="absolute top-14 right-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
          <Share2 size={18} className="text-white" />
        </div>
      </div>
      <div className="px-5 -mt-6 relative z-10">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-[#EAF6DD] border border-[#CAE5B1] rounded-full px-3 py-1.5">
            <Check size={12} className="text-[#69A20D]" />
            <span className="text-xs font-bold text-[#23351F]">{confidencePercent}% Match</span>
          </div>
          {isConfident && <Badge label="UNESCO Identified" color="gold" />}
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-2xl font-black text-[#222E1C] leading-tight mb-1 font-display">
          {siteName}
        </motion.h1>
        <div className="flex items-center gap-1 mb-4">
          <MapPin size={12} className="text-[#69A20D]" />
          <span className="text-[#5F6B5E] text-sm font-medium">{location}</span>
        </div>
        <div className="bg-white rounded-3xl p-4 mb-5 border border-[#E4E7EB] shadow-[0_4px_20px_rgba(35,53,31,0.03)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MascotSVG size={28} />
              <span className="text-[#23351F] text-xs font-black">Ara says</span>
            </div>
            <button
              onClick={() => {
                onSelectSite(siteName);
                onNav("audio");
              }}
              className="flex items-center gap-1.5 bg-[#23351F] text-white rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm hover:bg-[#172514] transition-all"
            >
              <Volume2 size={12} className="text-[#69A20D]" />
              <span>Listen Audio</span>
            </button>
          </div>
          <p className="text-[#222E1C] text-sm leading-relaxed font-medium">
            {description}
          </p>
        </div>
        {recognitionResult?.allScores && recognitionResult.allScores.length > 0 && (
          <div className="mb-5 bg-white p-4 rounded-3xl border border-[#E4E7EB] shadow-xs">
            <p className="text-[#222E1C] text-xs font-black mb-2">Recognition Confidence Scores</p>
            <div className="flex flex-col gap-2">
              {recognitionResult.allScores.map(([name, score]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-[#222E1C] text-xs font-bold flex-1">{name}</span>
                  <div className="w-24">
                    <ProgressBar value={score * 100} color={name === siteName ? '#69A20D' : '#94A3B8'} />
                  </div>
                  <span className="text-[#5F6B5E] text-[10px] w-10 text-right font-semibold">{(score * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Story Mode", icon: BookOpen, color: "#23351F", bg: "#EAF6DD", screen: "story" as Screen },
            { label: "Audio Guide", icon: Volume2, color: "#69A20D", bg: "#CAE5B1/40", screen: "audio" as Screen },
            { label: "Explore", icon: Compass, color: "#23351F", bg: "#EEF1F3", screen: "details" as Screen },
          ].map(({ label, icon: Icon, color, bg, screen }) => (
            <motion.button key={label} whileTap={{ scale: 0.95 }}
              onClick={() => { onSelectSite(siteName); onNav(screen); }}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl py-4 border border-[#E4E7EB] shadow-xs hover:border-[#69A20D]/40 transition-all">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-[#222E1C] text-xs font-bold">{label}</span>
            </motion.button>
          ))}
        </div>
        <div className="flex gap-3 mb-8">
          <GhostButton label="Save Place" full onClick={() => onNav("saved")} />
          <PrimaryButton label="Navigate" full icon={<Navigation size={14} />} onClick={() => onNav("map")} />
        </div>
      </div>
    </div>
  );
}

