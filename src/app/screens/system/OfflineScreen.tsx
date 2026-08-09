import { WifiOff, Check, Download } from "lucide-react";
import { NavBar } from "../../components/common/NavBar";
import { ProgressBar } from "../../components/common/ProgressBar";

export function OfflineScreen({ onBack }: { onBack: () => void }) {
  const packs = [
    { name: "Nepal Heritage Pack", size: "142 MB", sites: 28, downloaded: true },
    { name: "Italy Ancient Sites", size: "98 MB", sites: 19, downloaded: false },
    { name: "Peru & Machu Picchu", size: "76 MB", sites: 12, downloaded: false },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <NavBar title="Offline Mode" onBack={onBack} />
      <div className="px-5 pt-2 pb-8">
        <div className="flex items-center gap-3 bg-[#EAF6DD] rounded-2xl p-4 mb-5 border border-[#CAE5B1]">
          <WifiOff size={18} className="text-[#69A20D]" />
          <div>
            <p className="text-[#23351F] text-sm font-bold">Offline Ready</p>
            <p className="text-[#5F6B5E] text-xs font-medium">1 pack downloaded · 142 MB used</p>
          </div>
        </div>
        <h3 className="text-[#222E1C] text-sm font-black mb-3 font-display">Download Packs</h3>
        <div className="flex flex-col gap-3">
          {packs.map(p => (
            <div key={p.name} className="bg-white rounded-2xl p-4 border border-[#E4E7EB] shadow-xs">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[#222E1C] text-sm font-bold">{p.name}</p>
                  <p className="text-[#5F6B5E] text-xs mt-0.5">{p.sites} sites · {p.size}</p>
                </div>
                {p.downloaded ? (
                  <div className="flex items-center gap-1 bg-[#EAF6DD] rounded-full px-2.5 py-1 border border-[#CAE5B1]">
                    <Check size={10} className="text-[#69A20D]" />
                    <span className="text-[#23351F] text-[10px] font-bold">Downloaded</span>
                  </div>
                ) : (
                  <button className="flex items-center gap-1 bg-[#EEF1F3] rounded-full px-2.5 py-1 border border-[#E4E7EB]">
                    <Download size={10} className="text-[#69A20D]" />
                    <span className="text-[#222E1C] text-[10px] font-bold">Download</span>
                  </button>
                )}
              </div>
              {p.downloaded && <ProgressBar value={100} color="#69A20D" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
