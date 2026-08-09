import { ChevronRight } from "lucide-react";
import type { Screen } from "../../types/screen";
import { NavBar } from "../../components/common/NavBar";
import { Badge } from "../../components/common/Badge";

export function HistoryScreen({ onBack, onNav }: { onBack: () => void; onNav: (s: Screen) => void }) {
  const visits = [
    { name: "Pashupatinath Temple", loc: "Nepal", date: "Aug 2, 2026", duration: "1h 24m", img: "https://images.unsplash.com/photo-1761048800438-730332b87f7a?w=100&h=100&fit=crop" },
    { name: "Bindhyabasini Temple", loc: "Pokhara, Nepal", date: "Jul 28, 2026", duration: "2h 05m", img: "https://images.unsplash.com/photo-1760095888026-df3eeee6f302?w=100&h=100&fit=crop" },
    { name: "Patan Durbar Square", loc: "Lalitpur, Nepal", date: "Jul 15, 2026", duration: "3h 30m", img: "https://images.unsplash.com/photo-1777846937163-3eeddb48829d?w=100&h=100&fit=crop" },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <NavBar title="Visit History" onBack={onBack} />
      <div className="px-5 mb-4 pt-2">
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Sites Visited", val: "24" }, { label: "Hours Explored", val: "48" }, { label: "Stamps Collected", val: "8" }].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 border border-[#E4E7EB] text-center shadow-xs">
              <p className="text-[#23351F] text-xl font-black">{s.val}</p>
              <p className="text-[#5F6B5E] text-[10px] font-bold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 flex flex-col gap-3">
        <h3 className="text-[#222E1C] text-sm font-black font-display">Recent Visits</h3>
        {visits.map(v => (
          <button key={v.name} onClick={() => onNav("details")}
            className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#E4E7EB] shadow-xs hover:shadow-sm transition-all">
            <img src={v.img} alt={v.name} className="w-14 h-14 rounded-2xl object-cover" />
            <div className="flex-1 text-left">
              <p className="text-[#222E1C] text-sm font-bold">{v.name}</p>
              <p className="text-[#5F6B5E] text-xs mt-0.5">{v.loc}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge label={v.date} color="sand" />
                <Badge label={v.duration} color="indigo" />
              </div>
            </div>
            <ChevronRight size={16} className="text-[#5F6B5E]" />
          </button>
        ))}
      </div>
    </div>
  );
}
