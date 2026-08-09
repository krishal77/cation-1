import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Share2, Star, MapPin, Clock, Info, Wind, Coffee, Volume2 } from "lucide-react";
import { getHeritageSiteByName, type HeritageSite } from "../../services/api";
import type { Screen } from "../../types/screen";
import { getSiteImage } from "../../constants/siteImages";
import { Badge } from "../../components/common/Badge";
import { SkeletonCard } from "../../components/common/SkeletonCard";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { GhostButton } from "../../components/common/GhostButton";

export function DetailsScreen({ onNav, onBack, selectedSite }: { onNav: (s: Screen) => void; onBack: () => void; selectedSite: string }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "History", "Gallery", "Reviews"];
  const [site, setSite] = useState<HeritageSite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedSite) { setLoading(false); return; }
    setLoading(true);
    getHeritageSiteByName(selectedSite)
      .then(data => setSite(data))
      .catch(() => setSite(null))
      .finally(() => setLoading(false));
  }, [selectedSite]);

  const displayName = site?.name || selectedSite || "Heritage Site";
  const displayLocation = site?.location || "Nepal";
  const displayDesc = site?.description || `Explore the rich cultural history of ${displayName}.`;
  const displayTags = site?.tags || ["heritage", "cultural"];

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <div className="relative h-56 bg-[#EEF1F3] flex-shrink-0">
        <img src={getSiteImage(displayName)}
          alt={displayName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F9F6] via-transparent to-black/30" />
        <div className="absolute top-14 left-5 right-5 flex justify-between">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            {[Bookmark, Share2].map((Icon, i) => (
              <button key={i} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Icon size={18} className="text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="px-5 pt-4"><SkeletonCard /><SkeletonCard /></div>
      ) : (
        <div className="px-5 -mt-4 relative z-10">
          <div className="flex gap-2 mb-2">
            {displayTags.slice(0, 2).map(t => (
              <Badge key={t} label={t.replace(/_/g, ' ')} color="gold" />
            ))}
          </div>
          <h1 className="text-2xl font-black text-[#222E1C] mb-1 font-display">{displayName}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1"><Star size={12} className="text-[#69A20D] fill-[#69A20D]" /><span className="text-sm font-bold text-[#222E1C]">4.8</span></div>
            <span className="text-[#94A3B8] text-xs">·</span>
            <div className="flex items-center gap-1"><MapPin size={12} className="text-[#69A20D]" /><span className="text-[#5F6B5E] text-xs font-medium">{displayLocation}</span></div>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === t ? "bg-[#23351F] text-white shadow-sm" : "bg-[#EEF1F3] text-[#5F6B5E] border border-[#E4E7EB]"}`}>{t}</button>
            ))}
          </div>
          <div className="text-[#222E1C] text-sm leading-relaxed mb-5 bg-white p-4 rounded-3xl border border-[#E4E7EB] shadow-xs">
            {displayDesc}
            {site?.historicalSignificance && (
              <p className="mt-3 text-[#5F6B5E] border-t border-[#E4E7EB] pt-3">{site.historicalSignificance}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Open Hours", val: "4 AM – 9 PM", icon: Clock },
              { label: "Entry Fee", val: "NPR 400", icon: Info },
              { label: "Best Time", val: "Oct – Mar", icon: Wind },
              { label: "Duration", val: "2–3 Hours", icon: Coffee },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl p-3 border border-[#E4E7EB] flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 bg-[#EAF6DD] rounded-xl flex items-center justify-center border border-[#CAE5B1]">
                  <Icon size={14} className="text-[#69A20D]" />
                </div>
                <div>
                  <p className="text-[#5F6B5E] text-[10px] font-medium">{label}</p>
                  <p className="text-[#222E1C] text-xs font-bold">{val}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mb-8">
            <GhostButton label="Story Mode" full onClick={() => onNav("story")} />
            <PrimaryButton label="Audio Guide" full icon={<Volume2 size={14} />} onClick={() => onNav("audio")} />
          </div>
        </div>
      )}
    </div>
  );
}
