import { useState } from "react";
import { Languages, Check } from "lucide-react";
import { NavBar } from "../../components/common/NavBar";

export function LanguageScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState("English");
  const langs = [
    { name: "English", native: "English", flag: "🇺🇸" },
    { name: "Nepali", native: "नेपाली", flag: "🇳🇵" },
    { name: "Hindi", native: "हिंदी", flag: "🇮🇳" },
    { name: "Japanese", native: "日本語", flag: "🇯🇵" },
    { name: "French", native: "Français", flag: "🇫🇷" },
    { name: "Spanish", native: "Español", flag: "🇪🇸" },
    { name: "Chinese", native: "中文", flag: "🇨🇳" },
    { name: "Arabic", native: "العربية", flag: "🇸🇦" },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <NavBar title="Language" onBack={onBack} />
      <div className="px-5 pt-2 pb-8">
        <div className="flex items-center gap-2 bg-[#EAF6DD] rounded-2xl p-3.5 mb-5 border border-[#CAE5B1]">
          <Languages size={16} className="text-[#69A20D]" />
          <p className="text-[#23351F] text-xs font-semibold">Audio guides will be narrated in your selected language</p>
        </div>
        <div className="flex flex-col gap-2">
          {langs.map(l => (
            <button key={l.name} onClick={() => setSelected(l.name)}
              className={`flex items-center gap-3 rounded-2xl p-4 border transition-all ${selected === l.name ? "bg-[#EAF6DD] border-[#CAE5B1]" : "bg-white border-[#E4E7EB]"}`}>
              <span className="text-2xl">{l.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-[#222E1C] text-sm font-bold">{l.name}</p>
                <p className="text-[#5F6B5E] text-xs font-medium">{l.native}</p>
              </div>
              {selected === l.name && <Check size={18} className="text-[#69A20D]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
