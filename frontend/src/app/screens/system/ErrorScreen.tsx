import { AlertTriangle, RotateCcw } from "lucide-react";
import { NavBar } from "../../components/common/NavBar";
import { MascotSVG } from "../../components/common/MascotSVG";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { GhostButton } from "../../components/common/GhostButton";

export function ErrorScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <NavBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-5 border border-red-200">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        <h2 className="text-[#222E1C] text-xl font-black mb-2 font-display">Something went wrong</h2>
        <p className="text-[#5F6B5E] text-sm leading-relaxed mb-6">We couldn&apos;t load the heritage data. Please check your connection and try again.</p>
        <div className="flex flex-col gap-3 w-full">
          <PrimaryButton label="Try Again" full icon={<RotateCcw size={14} />} />
          <GhostButton label="Go Back" full onClick={onBack} />
        </div>
      </div>
      <div className="px-5 pb-8">
        <div className="flex items-center gap-3 bg-[#EAF6DD] rounded-2xl p-4 border border-[#CAE5B1]">
          <MascotSVG size={36} animate />
          <p className="text-[#23351F] text-xs leading-relaxed font-semibold">Don&apos;t worry! Ara is looking into the issue. You can also try offline mode.</p>
        </div>
      </div>
    </div>
  );
}
