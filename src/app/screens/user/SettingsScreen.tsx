import { useState } from "react";
import { motion } from "motion/react";
import { Moon, Sun, Bell, Download, Smartphone, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NavBar } from "../../components/common/NavBar";

export function SettingsScreen({ onBack, onLogout }: { onBack: () => void; onLogout?: () => void }) {
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors relative ${on ? "bg-[#23351F]" : "bg-[#EEF1F3]"}`}>
      <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs" animate={{ left: on ? "calc(100% - 22px)" : "2px" }} />
    </button>
  );
  const sections = [
    { title: "Appearance", items: [{ label: "Dark Mode", icon: darkMode ? Moon : Sun, toggle: () => setDarkMode(d => !d), val: darkMode }] },
    { title: "Notifications", items: [{ label: "Push Notifications", icon: Bell, toggle: () => setNotifications(n => !n), val: notifications }, { label: "Auto-Download", icon: Download, toggle: () => setAutoDownload(a => !a), val: autoDownload }] },
  ];

  const handleSignOut = () => {
    logout();
    onLogout?.();
  };

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <NavBar title="Settings" onBack={onBack} />
      <div className="px-5 flex flex-col gap-5 pt-2 pb-8">
        {sections.map(s => (
          <div key={s.title}>
            <p className="text-[#5F6B5E] text-xs font-bold uppercase tracking-wider mb-2">{s.title}</p>
            <div className="flex flex-col gap-2">
              {s.items.map(item => (
                <div key={item.label} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-[#E4E7EB]">
                  <div className="w-9 h-9 bg-[#EAF6DD] rounded-xl flex items-center justify-center border border-[#CAE5B1]">
                    <item.icon size={16} className="text-[#69A20D]" />
                  </div>
                  <span className="flex-1 text-sm font-bold text-[#222E1C]">{item.label}</span>
                  <Toggle on={item.val} onToggle={item.toggle} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="text-[#5F6B5E] text-xs font-bold uppercase tracking-wider mb-2">Device Application</p>
          <div className="bg-[#23351F] text-white rounded-2xl p-4 shadow-md border border-[#CAE5B1]/30">

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#69A20D] flex items-center justify-center text-white shadow-sm">
                <Smartphone size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black font-display text-white">Install App on Phone</p>
                <p className="text-[#CAE5B1] text-[11px] font-medium">Add to Home Screen for native experience</p>
              </div>
            </div>
            <p className="text-white/80 text-xs mb-3.5 leading-relaxed">
              Install AI Tourist Guide directly onto your iPhone, Android, or Desktop. Runs standalone offline with full camera & GPS maps!
            </p>
            <div className="bg-black/30 rounded-xl p-3 text-[11px] text-white/90 space-y-1 mb-3">
              <p className="font-bold text-[#CAE5B1]">📱 How to Install:</p>
              <p>• <b>iOS (Safari):</b> Tap Share icon <span className="font-mono">[↑]</span> → select <b>&quot;Add to Home Screen&quot;</b></p>
              <p>• <b>Android (Chrome):</b> Tap 3 dots <span className="font-mono">[⋮]</span> → select <b>&quot;Install App&quot;</b> or <b>&quot;Add to Home Screen&quot;</b></p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[#5F6B5E] text-xs font-bold uppercase tracking-wider mb-2">About</p>
          <div className="bg-white rounded-2xl border border-[#E4E7EB] overflow-hidden">
            {[{ label: "Version", val: "2.4.1 (PWA)" }, { label: "Privacy Policy", val: "" }, { label: "Terms of Service", val: "" }].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-4 border-b border-[#E4E7EB] last:border-b-0">
                <span className="flex-1 text-sm font-bold text-[#222E1C]">{item.label}</span>
                {item.val ? <span className="text-[#5F6B5E] text-xs font-medium">{item.val}</span> : <ChevronRight size={16} className="text-[#5F6B5E]" />}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleSignOut} className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 font-bold text-sm text-center hover:bg-red-100 transition-colors">Sign Out</button>
      </div>
    </div>
  );
}
