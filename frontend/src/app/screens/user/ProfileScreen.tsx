import { Settings, Check, Clock, Trophy, Languages, HardDrive, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Screen } from "../../types/screen";
import { Badge } from "../../components/common/Badge";
import { BottomNav } from "../../components/common/BottomNav";

export function ProfileScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { user } = useAuth();
  const displayName = user?.name || "Explorer";
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const stats = [{ label: "Sites", val: "24" }, { label: "Stories", val: "18" }, { label: "Friends", val: "142" }];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <div className="px-5 pt-12 sm:pt-14 pb-5 flex items-center justify-between bg-white border-b border-[#E4E7EB]">
        <h1 className="text-xl font-black text-[#222E1C] font-display">Profile</h1>
        <button onClick={() => onNav("settings")} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
          <Settings size={16} />
        </button>
      </div>
      <div className="mx-5 my-4 rounded-3xl overflow-hidden shadow-md" style={{ background: "linear-gradient(135deg, #23351F 0%, #2e4429 60%, #172514 100%)" }}>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#69A20D] flex items-center justify-center text-white text-xl font-black">{initials}</div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#69A20D] rounded-full border-2 border-white flex items-center justify-center">
                <Check size={10} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-white font-black text-lg font-display">{displayName}</p>
              <p className="text-[#CAE5B1] text-xs font-medium">{user?.email || '@explorer'}</p>
              <div className="mt-1">
                <Badge label="Gold Explorer" color="gold" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {stats.map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl py-2 text-center border border-white/10">
                <p className="text-white font-black text-lg">{s.val}</p>
                <p className="text-white/70 text-[10px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 flex flex-col gap-2">

        {[
          { label: "Visit History", icon: Clock, screen: "history" as Screen },
          { label: "Achievements", icon: Trophy, screen: "achievements" as Screen },
          { label: "Language", icon: Languages, screen: "language" as Screen },
          { label: "Offline Mode", icon: HardDrive, screen: "offline" as Screen },
          { label: "Settings", icon: Settings, screen: "settings" as Screen },
        ].map(({ label, icon: Icon, screen }) => (
          <button key={label} onClick={() => onNav(screen)}
            className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-[#E4E7EB] shadow-xs hover:border-[#69A20D]/40 transition-all">
            <div className="w-9 h-9 bg-[#EAF6DD] rounded-xl flex items-center justify-center border border-[#CAE5B1]">
              <Icon size={16} className="text-[#69A20D]" />
            </div>
            <span className="flex-1 text-left text-sm font-bold text-[#222E1C]">{label}</span>
            <ChevronRight size={16} className="text-[#5F6B5E]" />
          </button>
        ))}
      </div>
      <BottomNav active="profile" onNav={onNav} />
    </div>
  );
}
