import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, MapPin } from "lucide-react";
import { getHeritageSites, type HeritageSite } from "../../services/api";
import type { Screen } from "../../types/screen";
import { SITE_IMAGES, getSiteImage } from "../../constants/siteImages";
import { Badge } from "../../components/common/Badge";
import { Chip } from "../../components/common/Chip";
import { BottomNav } from "../../components/common/BottomNav";

export function ExploreScreen({ onNav, onSelectSite }: { onNav: (s: Screen) => void; onSelectSite: (name: string) => void }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Temples", "Buddhist", "UNESCO", "Palaces"];
  const [apiSites, setApiSites] = useState<HeritageSite[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    getHeritageSites()
      .then(data => setApiSites(data))
      .catch(() => setApiSites([]))
      .finally(() => setLoading(false));
  }, []);

  const sites = apiSites.length > 0
    ? apiSites.map((s, i) => ({
        name: s.name,
        loc: s.location,
        img: getSiteImage(s.name),
        r: 4.9 - i * 0.1,
      }))
    : [
        { name: "Bindhyabasini Temple", loc: "Pokhara, Nepal", img: SITE_IMAGES["Bindhyabasini Temple"], r: 4.9 },
        { name: "Lumbini", loc: "Rupandehi, Nepal", img: SITE_IMAGES["Lumbini"], r: 4.8 },
        { name: "Patan Durbar Square", loc: "Lalitpur, Nepal", img: SITE_IMAGES["Patan Durbar Square"], r: 4.7 },
        { name: "Pashupatinath Temple", loc: "Kathmandu, Nepal", img: SITE_IMAGES["Pashupatinath Temple"], r: 4.9 },
      ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <div className="px-5 pt-12 sm:pt-14 pb-3">
        <h1 className="text-2xl font-black text-[#222E1C] mb-1 font-display">Explore Heritage</h1>
        <p className="text-[#5F6B5E] text-sm font-medium">Discover World Heritage sites and ancient legends</p>
      </div>
      <div className="mx-5 rounded-3xl overflow-hidden h-36 relative mb-5 bg-[#23351F] shadow-sm">
        <img src="https://images.unsplash.com/photo-1781079974741-0635e52ef4c3?w=400&h=150&fit=crop" alt="explore" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#23351F]/90 via-[#23351F]/40 to-transparent" />
        <div className="absolute left-5 top-5">
          <p className="text-[#CAE5B1] text-xs font-bold uppercase tracking-wider">Featured UNESCO Collection</p>
          <h3 className="text-white text-base font-black font-display">Sacred Asian Temples</h3>
          <div className="mt-2">
            <Badge label="32 UNESCO Sites" color="gold" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide mb-5">
        {filters.map(f => <Chip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />)}
      </div>
      <div className="px-5 grid grid-cols-2 gap-3 mb-6">

        {sites.map(s => (
          <motion.button key={s.name} whileTap={{ scale: 0.97 }} onClick={() => { onSelectSite(s.name); onNav("details"); }}
            className="bg-white rounded-3xl overflow-hidden border border-[#E4E7EB] text-left shadow-xs hover:shadow-md transition-all duration-300 group">
            <div className="h-28 bg-[#EEF1F3] relative">
              <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/60">
                  <Star size={9} className="text-[#69A20D] fill-[#69A20D]" />
                  <span className="text-[#222E1C] text-[9px] font-bold">{s.r}</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[#222E1C] text-xs font-black leading-tight group-hover:text-[#69A20D] transition-colors">{s.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={9} className="text-[#69A20D]" />
                <p className="text-[#5F6B5E] text-[9px] font-medium">{s.loc}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      <BottomNav active="explore" onNav={onNav} />
    </div>
  );
}
