import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Bell, Search, Filter, Sparkles, Camera, ChevronRight,
  Volume2, BookOpen, MapPin, Compass, Clock
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getHeritageSites, type HeritageSite } from "../../services/api";
import { SITE_IMAGES, getSiteImage } from "../../constants/siteImages";
import type { Screen } from "../../types/screen";
import { MascotSVG } from "../../components/common/MascotSVG";
import { Chip } from "../../components/common/Chip";
import { Badge } from "../../components/common/Badge";
import { HeritageCard } from "../../components/common/HeritageCard";
import { SkeletonCard } from "../../components/common/SkeletonCard";
import { BottomNav } from "../../components/common/BottomNav";

export function HomeScreen({ onNav, onScan, onSelectSite }: { onNav: (s: Screen) => void; onScan: () => void; onSelectSite: (name: string) => void }) {
  const { user } = useAuth();
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState("All");

  const chips = ["All", "UNESCO", "Temples", "Buddhist", "Palaces", "Monuments"];

  useEffect(() => {
    getHeritageSites()
      .then(data => setSites(data))
      .catch(() => setSites([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = sites.length > 0
    ? sites.map((s, i) => ({
        name: s.name,
        location: s.location,
        img: getSiteImage(s.name),
        rating: 4.9 - i * 0.1,
      }))
    : [
        { name: "Bindhyabasini Temple", location: "Pokhara, Nepal", img: SITE_IMAGES["Bindhyabasini Temple"], rating: 4.9 },
        { name: "Lumbini", location: "Rupandehi, Nepal", img: SITE_IMAGES["Lumbini"], rating: 4.8 },
        { name: "Patan Durbar Square", location: "Lalitpur, Nepal", img: SITE_IMAGES["Patan Durbar Square"], rating: 4.7 },
      ];

  const recent = [
    { name: "Bindhyabasini Temple", location: "Pokhara, Kaski", img: getSiteImage("Bindhyabasini Temple"), time: "2h ago" },
    { name: "Patan Durbar Square", location: "Lalitpur, Nepal", img: getSiteImage("Patan Durbar Square"), time: "Yesterday" },
  ];

  const displayName = user?.name || "Explorer";
  const userInitials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "EX";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 18) return "Good Afternoon,";
    return "Good Evening,";
  };

  const quickActions = [
    { label: "AI Scan", icon: Camera, color: "bg-[#23351F]", textColor: "text-white", action: onScan },
    { label: "Audio Guide", icon: Volume2, color: "bg-[#EAF6DD]", textColor: "text-[#69A20D]", action: () => onNav("audio") },
    { label: "Story Mode", icon: BookOpen, color: "bg-[#CAE5B1]/50", textColor: "text-[#23351F]", action: () => onNav("story") },
    { label: "Map View", icon: MapPin, color: "bg-[#EEF1F3]", textColor: "text-[#69A20D]", action: () => onNav("map") },
  ];

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <div className="px-5 pt-12 sm:pt-14 pb-4 bg-gradient-to-b from-[#EAF6DD]/60 via-[#F7F9F6]/40 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#5F6B5E] text-xs font-medium">{getGreeting()}</p>
            <h1 className="text-xl font-black text-[#222E1C] flex items-center gap-1.5 font-display tracking-tight">
              {displayName}
              <span className="inline-block w-2 h-2 rounded-full bg-[#69A20D]" />
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNav("notifications")}
              className="w-10 h-10 rounded-2xl bg-white border border-[#E4E7EB] flex items-center justify-center relative shadow-xs hover:bg-[#EAF6DD] transition-all"
            >
              <Bell size={18} className="text-[#222E1C]" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#69A20D] rounded-full border-2 border-white" />
            </button>
            <button
              onClick={() => onNav("profile")}
              className="w-10 h-10 rounded-2xl bg-[#23351F] flex items-center justify-center shadow-sm hover:bg-[#172514] transition-all"
            >
              <span className="text-white text-xs font-black tracking-wider">{userInitials}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 mb-5">
        <button onClick={() => onNav("search")} className="w-full flex items-center gap-3 bg-white border border-[#E4E7EB] rounded-2xl px-4 py-3.5 shadow-xs hover:border-[#69A20D]/60 transition-all text-left">
          <Search size={18} className="text-[#69A20D]" />
          <span className="text-[#5F6B5E] text-sm flex-1 font-medium">Search heritage sites, temples, history...</span>
          <div className="bg-[#EAF6DD] rounded-xl p-1.5">
            <Filter size={14} className="text-[#23351F]" />
          </div>
        </button>
      </div>

      <div className="px-5 mb-6">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={onScan}
          className="w-full rounded-3xl p-5 relative overflow-hidden shadow-[0_8px_30px_rgba(35,53,31,0.18)] cursor-pointer"
          style={{ background: "linear-gradient(135deg, #23351F 0%, #2e4429 60%, #172514 100%)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#69A20D_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1 pr-3">
              <div className="inline-flex items-center gap-1.5 bg-[#69A20D]/25 border border-[#69A20D]/50 rounded-full px-2.5 py-0.5 mb-2">
                <Sparkles size={10} className="text-[#CAE5B1]" />
                <span className="text-[#CAE5B1] text-[10px] font-bold tracking-wider uppercase">OpenCLIP AI Powered</span>
              </div>
              <h3 className="text-white text-lg font-black leading-tight font-display">Identify Heritage Site</h3>
              <p className="text-white/80 text-xs mt-1">Point your camera or upload a photo for instant history & audio guide</p>
            </div>

            <div className="relative flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#69A20D]/30 blur-xl rounded-full" />
              <MascotSVG size={64} animate />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between relative z-10">
            <span className="text-white/90 text-xs font-bold flex items-center gap-1.5">
              <Camera size={14} className="text-[#CAE5B1]" /> Open Live Scanner
            </span>
            <div className="w-8 h-8 rounded-full bg-[#69A20D] text-white flex items-center justify-center shadow-md">
              <ChevronRight size={16} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map(act => (
            <motion.button
              key={act.label}
              whileTap={{ scale: 0.95 }}
              onClick={act.action}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E4E7EB] shadow-xs hover:shadow-sm hover:border-[#69A20D]/40 transition-all text-center"
            >
              <div className={`w-11 h-11 rounded-2xl ${act.color} flex items-center justify-center shadow-xs`}>
                <act.icon size={20} className={act.textColor} />
              </div>
              <span className="text-[#222E1C] text-[11px] font-bold leading-tight">{act.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-[#222E1C] font-display">Categories</h2>
        </div>
        <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide">
          {chips.map(c => (
            <Chip key={c} label={c} active={activeChip === c} onClick={() => setActiveChip(c)} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="px-5 mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#222E1C] font-display">Featured Heritage</h2>
            <p className="text-[#5F6B5E] text-xs font-medium">Explore top UNESCO destinations</p>
          </div>
          <button onClick={() => onNav("explore")} className="text-[#69A20D] text-xs font-black flex items-center gap-1 hover:underline">
            See all <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-3.5 px-5 overflow-x-auto scrollbar-hide py-1">
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : featured.map(f => (
                <HeritageCard
                  key={f.name}
                  {...f}
                  onClick={() => {
                    onSelectSite(f.name);
                    onNav("details");
                  }}
                />
              ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="bg-gradient-to-r from-[#EAF6DD] to-white border border-[#CAE5B1] rounded-3xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#23351F] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Compass size={22} className="text-[#CAE5B1]" />
          </div>
          <div className="flex-1">
            <Badge label="Daily Discovery" color="gold" />
            <h4 className="text-[#222E1C] text-xs font-black mt-1">Valley of Gods & Temples</h4>
            <p className="text-[#5F6B5E] text-[11px] mt-0.5 line-clamp-1">Did you know Kathmandu has 7 UNESCO World Heritage sites?</p>
          </div>
          <button onClick={() => onNav("explore")} className="text-[#69A20D] text-xs font-black underline">
            Read
          </button>
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-[#222E1C] font-display">Recent Scans & Visits</h2>
          <button onClick={() => onNav("history")} className="text-[#69A20D] text-xs font-black hover:underline">
            View history
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {recent.map(r => (
            <button
              key={r.name}
              onClick={() => {
                onSelectSite(r.name);
                onNav("details");
              }}
              className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#E4E7EB] shadow-xs hover:shadow-sm hover:border-[#69A20D]/40 transition-all text-left group"
            >
              <img src={r.img} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-[#222E1C] text-sm font-bold group-hover:text-[#69A20D] transition-colors">{r.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#5F6B5E] text-xs">{r.location}</span>
                  <span className="text-[#94A3B8] text-xs">·</span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-[#5F6B5E]" />
                    <span className="text-[#5F6B5E] text-[11px]">{r.time}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#5F6B5E] group-hover:text-[#69A20D] transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="home" onNav={onNav} />
    </div>
  );
}

