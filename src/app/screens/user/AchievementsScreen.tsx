import { NavBar } from "../../components/common/NavBar";
import { MascotSVG } from "../../components/common/MascotSVG";
import { Badge } from "../../components/common/Badge";
import { ProgressBar } from "../../components/common/ProgressBar";

export function AchievementsScreen({ onBack }: { onBack: () => void }) {
  const stamps = [
    { name: "Nepal Explorer", icon: "🏔️", earned: true, date: "Aug 2026" },
    { name: "Temple Seeker", icon: "🛕", earned: true, date: "Jul 2026" },
    { name: "UNESCO Pioneer", icon: "🌍", earned: true, date: "Jun 2026" },
    { name: "Stone Whisperer", icon: "🗿", earned: false, date: null },
    { name: "Ocean Voyager", icon: "🌊", earned: false, date: null },
    { name: "Desert Walker", icon: "🏜️", earned: false, date: null },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <NavBar title="Travel Passport" onBack={onBack} />
      <div className="mx-5 rounded-3xl p-5 mb-5 relative overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #23351F 0%, #2e4429 60%, #172514 100%)" }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5" style={{ transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[#69A20D]/20" style={{ transform: "translate(-30%, 30%)" }} />
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <MascotSVG size={40} />
          <div>
            <p className="text-white/70 text-xs font-semibold">Heritage Explorer Passport</p>
            <p className="text-white font-black text-base font-display">Priya Sharma</p>
          </div>
          <div className="ml-auto"><Badge label="Gold Explorer" color="gold" /></div>
        </div>
        <div className="grid grid-cols-3 gap-3 relative z-10">
          {[{ label: "Sites", val: "24" }, { label: "Stamps", val: "3" }, { label: "Points", val: "2,480" }].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-white text-xl font-black">{s.val}</p>
              <p className="text-white/70 text-[10px] font-medium">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 relative z-10">
          <div className="flex justify-between mb-1">
            <span className="text-white/70 text-xs">Progress to Platinum</span>
            <span className="text-[#CAE5B1] text-xs font-black">2,480 / 5,000</span>
          </div>
          <ProgressBar value={49.6} color="#69A20D" />
        </div>
      </div>
      <div className="px-5">

        <h3 className="text-[#222E1C] text-sm font-black mb-4 font-display">Passport Stamps</h3>
        <div className="grid grid-cols-3 gap-3">
          {stamps.map(s => (
            <div key={s.name} className={`rounded-2xl p-4 flex flex-col items-center gap-2 border ${s.earned ? "bg-white border-[#CAE5B1]" : "bg-[#EEF1F3] border-[#E4E7EB]"}`}>
              <div className={`text-3xl ${!s.earned ? "opacity-30 grayscale" : ""}`}>{s.icon}</div>
              <p className={`text-[10px] font-bold text-center leading-tight ${s.earned ? "text-[#222E1C]" : "text-[#94A3B8]"}`}>{s.name}</p>
              {s.earned ? <Badge label={s.date!} color="gold" /> : <span className="text-[9px] text-[#94A3B8] font-semibold">Locked</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
