import { useState, useEffect } from "react";
import { ArrowLeft, Search, X, MapPin, ChevronRight } from "lucide-react";
import { getHeritageSites, type HeritageSite } from "../../services/api";
import type { Screen } from "../../types/screen";
import { getSiteImage } from "../../constants/siteImages";
import { Badge } from "../../components/common/Badge";

export function SearchScreen({ onBack, onSelectSite, onNav }: { onBack: () => void; onSelectSite: (name: string) => void; onNav: (s: Screen) => void }) {
  const [query, setQuery] = useState("");
  const trending = ["Bindhyabasini Temple", "Lumbini", "Patan Durbar Square"];
  const [allSites, setAllSites] = useState<HeritageSite[]>([]);

  useEffect(() => {
    getHeritageSites()
      .then(data => setAllSites(data))
      .catch(() => setAllSites([]));
  }, []);

  const results = query
    ? allSites
        .filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.location.toLowerCase().includes(query.toLowerCase()))
        .map(s => ({ name: s.name, loc: s.location, type: s.tags?.[0]?.replace(/_/g, ' ') || 'Heritage', img: getSiteImage(s.name) }))
    : [];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <div className="px-5 pt-12 sm:pt-14 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#E4E7EB] rounded-2xl px-4 py-3 shadow-xs focus-within:border-[#69A20D]">
            <Search size={16} className="text-[#69A20D]" />
            <input autoFocus className="flex-1 text-sm text-[#222E1C] placeholder-[#94A3B8] bg-transparent outline-none font-medium"
              placeholder="Search sites, stories, cities..." value={query} onChange={e => setQuery(e.target.value)} />
            {query && <button onClick={() => setQuery("")}><X size={14} className="text-[#5F6B5E]" /></button>}
          </div>
        </div>
        {!query ? (
          <>
            <h3 className="text-[#222E1C] text-sm font-black mb-3 font-display">Trending Searches</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {trending.map(t => (
                <button key={t} onClick={() => setQuery(t)}
                  className="flex items-center gap-1.5 bg-white border border-[#E4E7EB] rounded-full px-3.5 py-2 text-xs font-bold text-[#5F6B5E] hover:border-[#69A20D]">
                  <Search size={10} className="text-[#69A20D]" />{t}
                </button>
              ))}
            </div>
            <h3 className="text-[#222E1C] text-sm font-black mb-3 font-display">Popular Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Temples & Shrines", count: "234", color: "#23351F", bg: "#EAF6DD" },
                { label: "Ancient Ruins", count: "189", color: "#69A20D", bg: "#CAE5B1/50" },
                { label: "Palaces & Forts", count: "156", color: "#23351F", bg: "#EEF1F3" },
                { label: "Sacred Monuments", count: "87", color: "#5F6B5E", bg: "#F7F9F6" },
              ].map(c => (
                <button key={c.label} className="bg-white rounded-2xl p-4 border border-[#E4E7EB] text-left shadow-xs hover:border-[#69A20D]/40 transition-all">
                  <div className="w-8 h-8 rounded-xl mb-2 flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                    <MapPin size={14} style={{ color: c.color }} />
                  </div>
                  <p className="text-[#222E1C] text-xs font-black">{c.label}</p>
                  <p className="text-[#5F6B5E] text-[10px] mt-0.5 font-medium">{c.count} sites</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-[#5F6B5E] text-xs mb-4 font-semibold">Results for &quot;{query}&quot;</p>
            <div className="flex flex-col gap-3">
              {results.map(r => (
                <button key={r.name} onClick={() => { onSelectSite(r.name); onNav("details"); }} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#E4E7EB] shadow-xs hover:shadow-sm transition-all w-full text-left">
                  <img src={r.img} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-[#222E1C] text-sm font-bold">{r.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      <Badge label={r.loc} color="sand" />
                      <Badge label={r.type} color="gold" />
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#5F6B5E]" />
                </button>
              ))}
              {results.length === 0 && (
                <div className="text-center py-12">
                  <Search size={40} className="text-[#EEF1F3] mx-auto mb-3" />
                  <p className="text-[#222E1C] font-bold">No results found</p>
                  <p className="text-[#5F6B5E] text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
