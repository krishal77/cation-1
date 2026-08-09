import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, AlertTriangle, Volume2 } from "lucide-react";
import { generateStory, type StoryData } from "../../services/api";
import type { Screen } from "../../types/screen";
import { getSiteImage } from "../../constants/siteImages";
import { MascotSVG } from "../../components/common/MascotSVG";
import { PrimaryButton } from "../../components/common/PrimaryButton";

export function StoryScreen({ onBack, selectedSite, onNav }: { onBack: () => void; selectedSite: string; onNav?: (s: Screen) => void }) {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [storyError, setStoryError] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    if (!selectedSite) { setLoading(false); return; }
    setLoading(true);
    setStoryError(null);
    generateStory(selectedSite)
      .then(data => setStoryData(data))
      .catch(err => setStoryError(err.message || 'Failed to generate story'))
      .finally(() => setLoading(false));
  }, [selectedSite]);

  const paragraphs = storyData?.narrative?.split('\n\n').filter(Boolean) || [];

  return (
    <div className="flex flex-col bg-[#172514] min-h-full flex-1 overflow-y-auto">
      <div className="relative w-full" style={{ height: 320 }}>
        <img src={getSiteImage(selectedSite)} alt={selectedSite} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172514] via-[#172514]/40 to-transparent" />
        <button onClick={onBack}
          className="absolute top-12 left-5 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white z-10">
          <ArrowLeft size={18} />
        </button>
        <div className="absolute top-12 right-5 bg-[#69A20D]/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-[#CAE5B1]/30">
          📖 Heritage Story
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[#69A20D]" />
              <span className="text-white/70 text-xs font-medium">Crafting your story...</span>
            </div>
          ) : storyData ? (
            <>
              {(storyData as any).subtitle && (
                <p className="text-[#CAE5B1] text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  {(storyData as any).subtitle}
                </p>
              )}
              <h1 className="text-white text-2xl font-black leading-tight font-display drop-shadow-lg">
                {storyData.title}
              </h1>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex-1 px-5 pb-10 -mt-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <MascotSVG size={70} animate />
            <p className="text-[#CAE5B1] text-sm font-bold mt-4">Ara is weaving your story...</p>
            <p className="text-white/40 text-xs mt-1">Preparing a rich cultural narrative</p>
          </div>
        ) : storyError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle size={36} className="text-red-400 mb-3" />
            <p className="text-white font-bold mb-2 font-display">Couldn't load story</p>
            <p className="text-white/50 text-sm mb-5">{storyError}</p>
            <PrimaryButton label="Try Again" onClick={() => {
              setLoading(true);
              generateStory(selectedSite).then(setStoryData).catch(e => setStoryError(e.message)).finally(() => setLoading(false));
            }} />
          </div>
        ) : storyData ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {(storyData as any).facts?.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-6 mt-4">
                {(storyData as any).facts.map((f: { label: string; value: string }, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-2.5 py-2.5 text-center">
                    <p className="text-[#69A20D] text-[8px] font-black uppercase tracking-wider mb-1">{f.label}</p>
                    <p className="text-white text-[10px] font-bold leading-tight">{f.value}</p>
                  </div>
                ))}
              </div>
            )}

            {(storyData as any).chapters?.length > 0 && (
              <div className="mb-5">
                <p className="text-white/50 text-[9px] font-black uppercase tracking-widest mb-2">Story Chapters</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {(storyData as any).chapters.map((ch: { title: string; body: string }, i: number) => (
                    <button key={i} onClick={() => setActiveChapter(i)}
                      className={`flex-shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                        activeChapter === i
                          ? 'bg-[#69A20D] text-white border-[#69A20D]'
                          : 'bg-white/5 text-white/60 border-white/10'
                      }`}>
                      {i + 1}. {ch.title}
                    </button>
                  ))}
                </div>
                <motion.div key={activeChapter}
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  className="mt-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#69A20D] flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">
                      {activeChapter + 1}
                    </div>
                    <p className="text-[#CAE5B1] text-xs font-black">{(storyData as any).chapters[activeChapter].title}</p>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {(storyData as any).chapters[activeChapter].body}
                  </p>
                </motion.div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-white/50 text-[9px] font-black uppercase tracking-widest mb-3">The Full Story</p>
              <div className="flex flex-col gap-4">
                {paragraphs.map((para, i) => (
                  <p key={i} className={`leading-7 ${i === 0 ? 'text-white text-sm font-medium' : 'text-white/70 text-sm'}`}>
                    {i === 0 && (
                      <span className="float-left text-[#69A20D] text-5xl font-black leading-none mr-2 mt-1 font-display">
                        {para[0]}
                      </span>
                    )}
                    {i === 0 ? para.slice(1) : para}
                  </p>
                ))}
              </div>
            </div>

            {(storyData as any).quote && (
              <div className="mb-6 border-l-4 border-[#69A20D] pl-4 py-2">
                <p className="text-white/80 text-sm italic leading-relaxed font-medium">
                  {(storyData as any).quote}
                </p>
              </div>
            )}

            {storyData.highlights?.length > 0 && (
              <div className="mb-6">
                <p className="text-white/50 text-[9px] font-black uppercase tracking-widest mb-3">Key Highlights</p>
                <div className="flex flex-col gap-2">
                  {storyData.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5">
                      <div className="w-5 h-5 rounded-full bg-[#69A20D]/20 border border-[#69A20D]/40 text-[#69A20D] flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-black">
                        {i + 1}
                      </div>
                      <p className="text-white/75 text-[12px] font-medium leading-relaxed">{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(storyData as any).tags?.length > 0 && (
              <div className="mb-6">
                <p className="text-white/50 text-[9px] font-black uppercase tracking-widest mb-2">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {(storyData as any).tags.map((tag: string) => (
                    <span key={tag}
                      className="bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold px-3 py-1 rounded-full">
                      #{tag.replace(/ /g, '')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-white/30 text-[10px] text-center mb-5 font-medium">
              {storyData.source} · {new Date(storyData.generatedAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>

            <div className="flex gap-3">
              {onNav && (
                <button onClick={() => onNav('audio')}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#69A20D] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-[#69A20D]/30">
                  <Volume2 size={16} />
                  Listen to Ara
                </button>
              )}
              <button onClick={onBack}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white font-bold text-sm py-3.5 rounded-2xl">
                <ArrowLeft size={16} />
                Go Back
              </button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

