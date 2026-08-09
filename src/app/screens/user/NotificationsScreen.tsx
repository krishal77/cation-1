import { MapPin, BookOpen, Trophy, Bell } from "lucide-react";
import { NavBar } from "../../components/common/NavBar";

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const notifs = [
    { title: "New heritage site near you!", body: "Patan Durbar Square is 1.2 km away. Tap to explore.", time: "2m ago", icon: MapPin, read: false },
    { title: "Ara has a new story for you", body: "Learn about the Legend of Kumari — Nepal's Living Goddess.", time: "1h ago", icon: BookOpen, read: false },
    { title: "Achievement Unlocked!", body: 'You earned the "Nepal Explorer" passport stamp!', time: "3h ago", icon: Trophy, read: true },
    { title: "Weekly Heritage Digest", body: "Discover 5 hidden gems in Southeast Asia this week.", time: "Yesterday", icon: Bell, read: true },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-full flex-1">
      <NavBar title="Notifications" onBack={onBack}
        right={<button className="text-[#69A20D] text-xs font-bold">Mark all read</button>} />
      <div className="px-5 flex flex-col gap-3 pt-2">
        {notifs.map(n => (
          <div key={n.title} className={`flex gap-3 rounded-2xl p-4 border ${n.read ? "bg-white border-[#E4E7EB]" : "bg-[#EAF6DD]/70 border-[#CAE5B1]"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.read ? "bg-[#EEF1F3]" : "bg-[#69A20D]/15"}`}>
              <n.icon size={16} className={n.read ? "text-[#5F6B5E]" : "text-[#23351F]"} />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-bold ${n.read ? "text-[#5F6B5E]" : "text-[#222E1C]"}`}>{n.title}</p>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#69A20D] flex-shrink-0 mt-1" />}
              </div>
              <p className="text-[#5F6B5E] text-xs mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-[#94A3B8] text-[10px] mt-1 font-semibold">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
