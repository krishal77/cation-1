import { useState } from "react";
import { motion } from "motion/react";
import { Bookmark, Compass, Filter, Star, MapPin, Volume2, BookOpen, ChevronRight } from "lucide-react";
import type { Screen } from "../../types/screen";
import { Badge } from "../../components/common/Badge";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { BottomNav } from "../../components/common/BottomNav";

export function SavedScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const saved = [
    {
      name: "Pashupatinath Temple",
      loc: "Kathmandu, Nepal",
      category: "UNESCO",
      rating: 4.9,
      img: "https://images.unsplash.com/photo-1761048803183-fc870f25e221?w=600&h=350&fit=crop",
      date: "Saved 3 days ago",
      tag: "Sacred Temple",
      audioReady: true,
    },
    {
      name: "Boudhanath Stupa",
      loc: "Kathmandu Valley",
      category: "Buddhist",
      rating: 4.8,
      img: "https://images.unsplash.com/photo-1761048804017-caa6ed93b8d1?w=600&h=350&fit=crop",
      date: "Saved 1 week ago",
      tag: "Buddhist Shrine",
      audioReady: true,
    },
    {
      name: "Bindhyabasini Temple",
      loc: "Pokhara, Nepal",
      category: "Temple",
      rating: 4.9,
      img: "https://images.unsplash.com/photo-1783682390495-b786c1939608?w=600&h=350&fit=crop",
      date: "Saved 2 weeks ago",
      tag: "Mountain Shrine",
      audioReady: true,
    },
    {
      name: "Patan Durbar Square",
      loc: "Lalitpur, Nepal",
      category: "UNESCO",
      rating: 4.8,
      img: "https://images.unsplash.com/photo-1779209344034-23d80393eaa8?w=600&h=350&fit=crop",
      date: "Saved 1 month ago",
      tag: "Malla Palace",
      audioReady: true,
    },
  ];

  const categories = ["All", "UNESCO", "Temple", "Buddhist"];

  const filtered = activeCategory === "All"
    ? saved
    : saved.filter(s => s.category === activeCategory);

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <div className="px-5 pt-12 sm:pt-14 pb-4 bg-white border-b border-[#E4E7EB] shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-black text-[#222E1C] font-display tracking-tight">Saved Places</h1>
            <p className="text-[#5F6B5E] text-xs font-medium mt-0.5">Your personal collection of heritage landmarks</p>
          </div>
          <div className="flex items-center gap-1 bg-[#EAF6DD] border border-[#CAE5B1] rounded-full px-3 py-1.5">
            <Bookmark size={12} className="text-[#69A20D] fill-[#69A20D]" />
            <span className="text-[#23351F] text-xs font-bold">{saved.length} Saved</span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2">
        <div className="bg-gradient-to-r from-[#23351F] via-[#2e4429] to-[#172514] rounded-3xl p-4 text-white shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#69A20D]/25 border border-[#69A20D]/40 flex items-center justify-center">
              <Bookmark size={18} className="text-[#CAE5B1]" />
            </div>
            <div>
              <p className="text-[#CAE5B1] text-[10px] font-bold uppercase tracking-wider">Heritage Passport</p>
              <p className="text-white text-xs font-bold">{saved.length} Bookmarked · 2 UNESCO Sites</p>
            </div>
          </div>
          <button onClick={() => onNav("explore")} className="bg-[#69A20D] hover:bg-[#58890a] text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all shadow-xs">
            + Add
          </button>
        </div>
      </div>

      <div className="px-5 py-3 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat
                  ? "bg-[#23351F] text-white border-[#23351F]"
                  : "bg-white text-[#5F6B5E] border-[#E4E7EB] hover:border-[#69A20D]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-white border border-[#E4E7EB] rounded-full p-1 flex-shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              viewMode === "grid" ? "bg-[#23351F] text-white" : "text-[#5F6B5E]"
            }`}
          >
            <Compass size={13} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              viewMode === "list" ? "bg-[#23351F] text-white" : "text-[#5F6B5E]"
            }`}
          >
            <Filter size={13} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-10 py-12 text-center">
          <div className="w-20 h-20 bg-[#EEF1F3] rounded-full flex items-center justify-center mb-4 border border-[#E4E7EB]">
            <Bookmark size={36} className="text-[#94A3B8]" />
          </div>
          <h3 className="text-[#222E1C] font-black text-lg mb-1 font-display">No saved places in this category</h3>
          <p className="text-[#5F6B5E] text-xs mb-6">Explore World Heritage sites and save your favorites</p>
          <PrimaryButton label="Start Exploring" onClick={() => onNav("explore")} />
        </div>
      ) : viewMode === "grid" ? (
        <div className="px-5 flex flex-col gap-4 pb-8 pt-1">
          {filtered.map(s => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-3xl overflow-hidden border border-[#E4E7EB] shadow-[0_4px_20px_rgba(35,53,31,0.03)] hover:shadow-[0_8px_30px_rgba(35,53,31,0.06)] transition-all duration-300 group"
            >
              <div className="h-44 bg-[#EEF1F3] relative overflow-hidden">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <Badge label={s.tag} color="gold" />
                  <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#69A20D] flex items-center justify-center shadow-md border border-white/60">
                    <Bookmark size={14} className="fill-[#69A20D]" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/60 shadow-xs">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-[#222E1C] text-xs font-bold">{s.rating}</span>
                </div>

                <span className="absolute bottom-3 right-3 text-white/80 text-[10px] font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {s.date}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-[#222E1C] font-black text-base font-display leading-tight">{s.name}</h3>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <MapPin size={12} className="text-[#69A20D]" />
                  <span className="text-[#5F6B5E] text-xs font-medium">{s.loc}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#F0F2F0]">
                  <button
                    onClick={() => { onNav("audio"); }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#EAF6DD] text-[#23351F] border border-[#CAE5B1] py-2 rounded-2xl text-xs font-bold hover:bg-[#CAE5B1]/50 transition-all"
                  >
                    <Volume2 size={13} className="text-[#69A20D]" />
                    Audio Guide
                  </button>
                  <button
                    onClick={() => { onNav("story"); }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#EEF1F3] text-[#222E1C] border border-[#E4E7EB] py-2 rounded-2xl text-xs font-bold hover:bg-white transition-all"
                  >
                    <BookOpen size={13} className="text-[#23351F]" />
                    Story
                  </button>
                  <button
                    onClick={() => { onNav("details"); }}
                    className="w-9 h-9 rounded-2xl bg-[#23351F] text-white flex items-center justify-center flex-shrink-0 shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-2.5 pb-8 pt-1">
          {filtered.map(s => (
            <motion.div
              key={s.name}
              onClick={() => onNav("details")}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#E4E7EB] shadow-xs hover:border-[#69A20D]/40 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-xl bg-[#EEF1F3] overflow-hidden flex-shrink-0 relative">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#222E1C] font-black text-sm truncate font-display">{s.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={10} className="text-[#69A20D]" />
                  <p className="text-[#5F6B5E] text-xs font-medium truncate">{s.loc}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge label={s.category} color="gold" />
                  <span className="text-[#94A3B8] text-[10px] font-medium">{s.date}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#5F6B5E] group-hover:text-[#69A20D] transition-colors" />
            </motion.div>
          ))}
        </div>
      )}

      <BottomNav active="saved" onNav={onNav} />
    </div>
  );
}

