import { motion } from "motion/react";
import { Home, Compass, Map, Bookmark, User } from "lucide-react";
import type { Screen } from "../../types/screen";

export function BottomNav({ active, onNav }: { active: string; onNav: (s: Screen) => void }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "explore", icon: Compass, label: "Explore" },
    { id: "map", icon: Map, label: "Map" },
    { id: "saved", icon: Bookmark, label: "Saved" },
    { id: "profile", icon: User, label: "Profile" },
  ] as const;
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#E4E7EB] px-3 pt-2.5 pb-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {items.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => onNav(id as Screen)} className="flex flex-col items-center gap-1 px-3 py-1 relative group">
            {active === id && (
              <motion.div layoutId="navpill" className="absolute inset-0 bg-[#EAF6DD] rounded-2xl border border-[#CAE5B1]/50" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <Icon size={21} className={`transition-colors relative z-10 ${active === id ? "text-[#69A20D]" : "text-[#5F6B5E] group-hover:text-[#222E1C]"}`} />
            <span className={`text-[10px] font-bold tracking-tight transition-colors relative z-10 ${active === id ? "text-[#23351F]" : "text-[#5F6B5E] group-hover:text-[#222E1C]"}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
