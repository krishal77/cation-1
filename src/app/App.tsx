import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Camera, MapPin, Bookmark, Clock, Star, ChevronRight,
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2,
  Mic, MicOff, Send, Key, MessageSquare, Wifi, WifiOff, Bell, Settings, User, Globe, Heart,
  Trophy, Compass, Home, BookOpen, MoreHorizontal, X, Check,
  Filter, Share2, Download, Eye, Navigation, Zap, Moon, Sun,
  ChevronDown, Plus, Minus, RotateCcw, Info, Award, Map,
  Languages, HardDrive, AlertTriangle, Coffee, Wind, Loader2, Sparkles
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import {
  getHeritageSites,
  getHeritageSiteByName,
  recognizeSite as apiRecognizeSite,
  generateStory,
  chatWithGuide,
  type HeritageSite,
  type RecognitionResult,
  type StoryData,
  type ChatGuideMessage,
} from "./services/api";

// ── Types ──────────────────────────────────────────────────────────────────
type Screen =
  | "splash" | "onboarding" | "login" | "register" | "home"
  | "camera" | "scanning" | "result" | "details" | "story"
  | "audio" | "map" | "explore" | "search" | "saved" | "history"
  | "achievements" | "notifications" | "profile" | "settings"
  | "language" | "offline" | "error" | "empty";

// ── Mascot (Himalayan Guardian Spirit) ─────────────────────────────────────
function MascotSVG({ size = 80, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 120 120" fill="none"
      animate={animate ? { y: [0, -8, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Glow aura */}
      <circle cx="60" cy="60" r="52" fill="url(#aura)" opacity="0.35" />
      {/* Body — floating spirit form */}
      <ellipse cx="60" cy="72" rx="22" ry="14" fill="#23351F" opacity="0.15" />
      <path d="M38 58 Q60 32 82 58 Q78 80 60 84 Q42 80 38 58Z" fill="url(#bodyGrad)" />
      {/* Robe detail */}
      <path d="M46 64 Q60 70 74 64 Q72 78 60 82 Q48 78 46 64Z" fill="#172514" opacity="0.3" />
      {/* Head */}
      <circle cx="60" cy="48" r="18" fill="url(#headGrad)" />
      {/* Face */}
      <ellipse cx="54" cy="47" rx="3.5" ry="4" fill="white" />
      <ellipse cx="66" cy="47" rx="3.5" ry="4" fill="white" />
      <circle cx="54.5" cy="47.5" r="2" fill="#222E1C" />
      <circle cx="66.5" cy="47.5" r="2" fill="#222E1C" />
      <circle cx="55.5" cy="46.5" r="0.8" fill="white" />
      <circle cx="67.5" cy="46.5" r="0.8" fill="white" />
      {/* Smile */}
      <path d="M54 55 Q60 60 66 55" stroke="#222E1C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Cheeks */}
      <circle cx="50" cy="53" r="3" fill="#69A20D" opacity="0.4" />
      <circle cx="70" cy="53" r="3" fill="#69A20D" opacity="0.4" />
      {/* Crown / Himalayan motif */}
      <path d="M44 38 L48 28 L52 35 L56 22 L60 32 L64 22 L68 35 L72 28 L76 38" stroke="#69A20D" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="60" cy="22" r="3" fill="#69A20D" />
      {/* Wisps / energy trails */}
      <path d="M34 60 Q26 52 32 42 Q36 36 42 44" stroke="#69A20D" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.6" />
      <path d="M86 60 Q94 52 88 42 Q84 36 78 44" stroke="#69A20D" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.6" />
      {/* Sparkles */}
      <circle cx="28" cy="38" r="2" fill="#69A20D" opacity="0.8" />
      <circle cx="92" cy="38" r="2" fill="#69A20D" opacity="0.8" />
      <circle cx="32" cy="76" r="1.5" fill="#23351F" opacity="0.5" />
      <circle cx="88" cy="76" r="1.5" fill="#23351F" opacity="0.5" />
      <defs>
        <radialGradient id="aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#69A20D" />
          <stop offset="100%" stopColor="#23351F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#69A20D" />
          <stop offset="100%" stopColor="#23351F" />
        </linearGradient>
        <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAF6DD" />
          <stop offset="100%" stopColor="#CAE5B1" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

// ── Shared UI Components ───────────────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full min-h-screen sm:min-h-[840px] sm:h-[852px] sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#FFFFFF] overflow-hidden sm:rounded-[36px] sm:shadow-xl sm:border sm:border-[#E4E7EB] flex-shrink-0 transition-all duration-300">
      {/* Simulated status bar (visible on desktop frame) */}
      <div className="hidden sm:flex absolute top-0 left-0 right-0 h-12 z-50 items-center justify-between px-8 text-[#222E1C]">
        <span className="text-[11px] font-bold tracking-tight">9:41</span>
        <div className="w-24 h-5 bg-[#23351F] rounded-full absolute left-1/2 -translate-x-1/2 top-1" />
        <div className="flex gap-1.5 items-center text-[10px]">
          <span className="font-bold text-[#69A20D]">5G</span>
          <div className="w-4 h-2.5 border border-[#222E1C] rounded-[2px] relative"><div className="absolute inset-[1px] right-[2px] bg-[#69A20D] rounded-[1px]" /></div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col bg-[#F7F9F6]">
        {children}
      </div>
    </div>
  );
}

function NavBar({ title, onBack, right }: { title?: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-5 pt-12 sm:pt-14 pb-3.5 flex items-center gap-3 border-b border-[#E4E7EB] shadow-xs">
      {onBack && (
        <motion.button whileTap={{ scale: 0.94 }} onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center flex-shrink-0 hover:bg-[#CAE5B1]/50 transition-colors text-[#222E1C]">
          <ArrowLeft size={18} />
        </motion.button>
      )}
      {title && <h1 className="flex-1 text-lg font-black text-[#222E1C] font-display truncate">{title}</h1>}
      {right && <div className="flex-shrink-0">{right}</div>}
    </div>
  );
}

function BottomNav({ active, onNav }: { active: string; onNav: (s: Screen) => void }) {
  const items = [
    { id: "home", icon: Home, label: "Home" },
    { id: "explore", icon: Compass, label: "Explore" },
    { id: "map", icon: Map, label: "Map" },
    { id: "saved", icon: Bookmark, label: "Saved" },
    { id: "profile", icon: User, label: "Profile" },
  ] as const;
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#E4E7EB] px-3 pt-2.5 pb-6 z-40 shadow-sm">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {items.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => onNav(id as Screen)} className="flex flex-col items-center gap-1 px-3 py-1 relative group">
            {active === id && (
              <motion.div layoutId="navpill" className="absolute inset-0 bg-[#EAF6DD] rounded-2xl border border-[#CAE5B1]/40" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <Icon size={22} className={`transition-colors relative z-10 ${active === id ? "text-[#69A20D]" : "text-[#5F6B5E] group-hover:text-[#222E1C]"}`} />
            <span className={`text-[10px] font-bold transition-colors relative z-10 ${active === id ? "text-[#23351F]" : "text-[#5F6B5E] group-hover:text-[#222E1C]"}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Badge({ label, color = "gold" }: { label: string; color?: "gold" | "indigo" | "green" | "sand" }) {
  const styles: Record<string, string> = {
    gold: "bg-[#CAE5B1]/60 text-[#23351F] border border-[#69A20D]/30",
    indigo: "bg-[#EAF6DD] text-[#23351F] border border-[#CAE5B1]",
    green: "bg-[#69A20D]/15 text-[#23351F] border border-[#69A20D]/40",
    sand: "bg-[#EEF1F3] text-[#5F6B5E] border border-[#E4E7EB]",
  };
  return <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${styles[color]}`}>{label}</span>;
}

function Chip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${active ? "bg-[#23351F] text-white shadow-sm border border-[#23351F]" : "bg-[#EEF1F3] text-[#5F6B5E] border border-[#E4E7EB] hover:bg-[#EAF6DD] hover:text-[#222E1C]"}`}>
      {label}
    </button>
  );
}

function ProgressBar({ value, color = "#69A20D" }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-[#EEF1F3] rounded-full overflow-hidden border border-[#E4E7EB]">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/80 rounded-3xl p-4 animate-pulse border border-[#E4E7EB]">
      <div className="h-32 bg-[#EEF1F3] rounded-2xl mb-3" />
      <div className="h-4 bg-[#EEF1F3] rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-[#EEF1F3] rounded-full w-1/2" />
    </div>
  );
}

function HeritageCard({ name, location, img, rating, onClick }: {
  name: string; location: string; img: string; rating: number; onClick?: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-xs hover:shadow-md border border-[#E4E7EB] flex-shrink-0 w-52 text-left transition-all group"
    >
      <div className="relative h-32 bg-[#EEF1F3]">
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-2.5 right-2.5">
          <Badge label="UNESCO" color="gold" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/40">
          <Star size={10} className="text-[#69A20D] fill-[#69A20D]" />
          <span className="text-[#222E1C] text-[10px] font-bold">{rating}</span>
        </div>
      </div>
      <div className="p-3.5">
        <p className="text-[#222E1C] text-sm font-black leading-tight group-hover:text-[#69A20D] transition-colors">{name}</p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={11} className="text-[#69A20D]" />
          <p className="text-[#5F6B5E] text-[11px] font-medium">{location}</p>
        </div>
      </div>
    </motion.button>
  );
}

function InputField({ placeholder, type = "text", icon, value, onChange }: { placeholder: string; type?: string; icon?: React.ReactNode; value?: string; onChange?: (v: string) => void }) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B5E]">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full bg-[#EEF1F3] border border-[#E4E7EB] focus:border-[#69A20D] focus:bg-white rounded-2xl py-3.5 text-sm text-[#222E1C] placeholder-[#A7B1A7] outline-none transition-all ${icon ? "pl-12 pr-4" : "px-4"}`}
      />
    </div>
  );
}

function PrimaryButton({ label, onClick, full = false, icon }: { label: string; onClick?: () => void; full?: boolean; icon?: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`bg-[#23351F] text-white font-bold rounded-2xl py-3.5 px-6 text-sm shadow-md hover:bg-[#1a2917] flex items-center justify-center gap-2 transition-all ${full ? "w-full" : ""}`}
    >
      {icon}{label}
    </motion.button>
  );
}

function GoldButton({ label, onClick, full = false }: { label: string; onClick?: () => void; full?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`bg-[#69A20D] text-white font-bold rounded-2xl py-3.5 px-6 text-sm shadow-md hover:bg-[#58890a] transition-all ${full ? "w-full" : ""}`}
    >
      {label}
    </motion.button>
  );
}

function GhostButton({ label, onClick, full = false }: { label: string; onClick?: () => void; full?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`bg-white text-[#23351F] border border-[#CAE5B1] font-bold rounded-2xl py-3.5 px-6 text-sm hover:bg-[#EAF6DD] transition-all shadow-xs ${full ? "w-full" : ""}`}
    >
      {label}
    </motion.button>
  );
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="h-full min-h-[852px] flex flex-col items-center justify-center relative overflow-hidden bg-[#F7F9F6]"
      style={{ background: "linear-gradient(160deg, #23351F 0%, #354f2f 50%, #172514 100%)" }}>
      {/* Background mandala rings */}
      {[120, 200, 280, 360].map((r, i) => (
        <motion.div key={i} className="absolute rounded-full border border-white/10"
          style={{ width: r, height: r }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Sage particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#69A20D]"
          style={{ left: `${10 + (i * 7) % 80}%`, top: `${10 + (i * 11) % 80}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center gap-6 z-10">
        <MascotSVG size={120} animate />
        <div className="text-center">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-4xl font-black text-white tracking-tight leading-tight font-display">
            Culture<br /><span className="text-[#CAE5B1]">Guide</span> AI
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-[#CAE5B1]/80 text-sm mt-2 font-semibold">Your Living UNESCO Heritage Guide</motion.p>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-20 flex flex-col items-center gap-3 z-10">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#69A20D]"
              animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
        <p className="text-white/60 text-xs font-medium">Powered by OpenCLIP AI</p>
      </motion.div>
    </div>
  );
}

const ONBOARDING = [
  {
    img: "https://images.unsplash.com/photo-1761048800438-730332b87f7a?w=800&h=500&fit=crop&auto=format",
    title: "Discover Hidden Stories",
    body: "Point your camera at any heritage site and unlock centuries of history, culture, and forgotten legends.",
    badge: "AI Recognition",
  },
  {
    img: "https://images.unsplash.com/photo-1761048804017-caa6ed93b8d1?w=800&h=500&fit=crop&auto=format",
    title: "Guided by Your Spirit",
    body: "Ara, your Himalayan AI guardian, narrates immersive stories and audio guides as you explore.",
    badge: "Audio Storytelling",
  },
  {
    img: "https://images.unsplash.com/photo-1779209344034-23d80393eaa8?w=800&h=500&fit=crop&auto=format",
    title: "Earn Your Travel Passport",
    body: "Collect stamps, unlock achievements, and build your legacy as a certified heritage explorer.",
    badge: "Travel Passport",
  },
];

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const cur = ONBOARDING[step];
  return (
    <div className="h-full min-h-[852px] flex flex-col bg-[#F7F9F6]">
      <div className="relative flex-shrink-0">
        <div className="h-72 bg-[#EEF1F3] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img key={step} src={cur.img} alt={cur.title}
              className="w-full h-full object-cover"
              initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.4 }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F9F6] via-transparent to-transparent" />
        </div>
        <div className="absolute top-16 right-5">
          <button onClick={onDone} className="text-[#222E1C] text-xs font-bold bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E4E7EB] shadow-xs">Skip</button>
        </div>
      </div>
      <div className="flex-1 flex flex-col px-6 pt-2">
        <div className="flex gap-2 mb-6">
          {ONBOARDING.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${i === step ? "bg-[#23351F]" : "bg-[#EEF1F3]"}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
            <Badge label={cur.badge} color="gold" />
            <h2 className="text-3xl font-black text-[#222E1C] mt-3 leading-tight font-display">{cur.title}</h2>
            <p className="text-[#5F6B5E] text-base leading-relaxed mt-3">{cur.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-auto pb-10 flex flex-col gap-3">
          <PrimaryButton label={step < 2 ? "Continue" : "Get Started"} full
            onClick={() => step < 2 ? setStep(s => s + 1) : onDone()} />
          {step > 0 && <GhostButton label="Back" full onClick={() => setStep(s => s - 1)} />}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onDone, onRegister }: { onDone: () => void; onRegister: () => void }) {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    clearError();
    setLocalError(null);
    if (!email || !password) {
      setLocalError("Please enter email and password");
      return;
    }
    try {
      await login(email, password);
      onDone();
    } catch (err: unknown) {
      // error is set in context
    }
  };

  const displayError = localError || error;

  return (
    <div className="h-full min-h-[852px] flex flex-col bg-[#F7F9F6] px-6 pt-16">
      <div className="flex flex-col items-center mb-8">
        <MascotSVG size={72} animate />
        <h1 className="text-3xl font-black text-[#222E1C] mt-4 font-display">Welcome Back</h1>
        <p className="text-[#5F6B5E] text-sm mt-1">Sign in to continue your heritage journey</p>
      </div>
      <div className="flex flex-col gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-[#E4E7EB] shadow-sm">
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-xs font-medium">
            {displayError}
          </div>
        )}
        <InputField placeholder="Email address" icon={<User size={16} />} value={email} onChange={setEmail} />
        <InputField placeholder="Password" type="password" icon={<Eye size={16} />} value={password} onChange={setPassword} />
        <div className="text-right">
          <button className="text-[#69A20D] text-xs font-bold hover:underline">Forgot password?</button>
        </div>
        <PrimaryButton label={isLoading ? "Signing In..." : "Sign In"} full onClick={handleLogin} />
        <div className="relative flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[#E4E7EB]" />
          <span className="text-[#A7B1A7] text-xs font-medium">or continue with</span>
          <div className="flex-1 h-px bg-[#E4E7EB]" />
        </div>
        <div className="flex gap-3">
          {["Google", "Apple"].map(p => (
            <button key={p} className="flex-1 flex items-center justify-center gap-2 border border-[#E4E7EB] rounded-2xl py-3 text-xs font-bold text-[#222E1C] bg-[#EEF1F3] hover:bg-[#EAF6DD] transition-all">
              <Globe size={15} className="text-[#69A20D]" />{p}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto pb-10 text-center">
        <span className="text-[#5F6B5E] text-sm">New explorer? </span>
        <button onClick={onRegister} className="text-[#23351F] text-sm font-black underline">Create Account</button>
      </div>
    </div>
  );
}

function RegisterScreen({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const { register, isLoading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    clearError();
    setLocalError(null);
    if (!firstName || !email || !password) {
      setLocalError("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    try {
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      await register(fullName, email, password);
      onDone();
    } catch (err: unknown) {
      // error is set in context
    }
  };

  const displayError = localError || error;

  return (
    <div className="h-full min-h-[852px] flex flex-col bg-[#F7F9F6] px-6 pt-14">
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center mb-4 text-[#222E1C]">
        <ArrowLeft size={18} />
      </button>
      <h1 className="text-3xl font-black text-[#222E1C] font-display">Join the Journey</h1>
      <p className="text-[#5F6B5E] text-sm mt-1 mb-6">Create your UNESCO heritage passport</p>
      <div className="flex flex-col gap-3.5 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-[#E4E7EB] shadow-sm">
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-xs font-medium">
            {displayError}
          </div>
        )}
        <div className="flex gap-3">
          <InputField placeholder="First Name" value={firstName} onChange={setFirstName} />
          <InputField placeholder="Last Name" value={lastName} onChange={setLastName} />
        </div>
        <InputField placeholder="Email address" icon={<User size={16} />} value={email} onChange={setEmail} />
        <InputField placeholder="Password" type="password" icon={<Eye size={16} />} value={password} onChange={setPassword} />
        <div className="flex items-start gap-2.5 mt-1">
          <div className="w-5 h-5 rounded bg-[#23351F] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check size={12} className="text-white" />
          </div>
          <p className="text-[#5F6B5E] text-xs leading-relaxed">I agree to the Terms of Service and Privacy Policy</p>
        </div>
        <PrimaryButton label={isLoading ? "Creating Account..." : "Create Account"} full onClick={handleRegister} />
      </div>
      <div className="mt-auto pb-10 text-center">
        <span className="text-[#5F6B5E] text-sm">Already exploring? </span>
        <button onClick={onBack} className="text-[#23351F] text-sm font-black underline">Sign In</button>
      </div>
    </div>
  );
}

// Heritage site images for display
const SITE_IMAGES: Record<string, string> = {
  "Bindhyabasini Temple": "https://images.unsplash.com/photo-1761048800438-730332b87f7a?w=400&h=250&fit=crop",
  "Lumbini": "https://images.unsplash.com/photo-1761048804017-caa6ed93b8d1?w=400&h=250&fit=crop",
  "Patan Durbar Square": "https://images.unsplash.com/photo-1779209344034-23d80393eaa8?w=400&h=250&fit=crop",
  "Pashupatinath Temple": "https://images.unsplash.com/photo-1761048803183-fc870f25e221?w=400&h=250&fit=crop",
  "Boudhanath Stupa": "https://images.unsplash.com/photo-1761048804017-caa6ed93b8d1?w=400&h=250&fit=crop",
};
const DEFAULT_SITE_IMG = "https://images.unsplash.com/photo-1783682390495-b786c1939608?w=400&h=250&fit=crop";
function getSiteImage(name: string): string {
  return SITE_IMAGES[name] || DEFAULT_SITE_IMG;
}

function HomeScreen({ onNav, onScan, onSelectSite }: { onNav: (s: Screen) => void; onScan: () => void; onSelectSite: (name: string) => void }) {
  const { user } = useAuth();
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChip, setActiveChip] = useState("All");

  const chips = ["All", "UNESCO", "Temples", "Buddhist", "Palaces", "Monuments"];

  useEffect(() => {
    getHeritageSites()
      .then(data => setSites(data))
      .catch(() => setSites([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = sites.length > 0
    ? sites.map((s, i) => ({
        name: s.name,
        location: s.location,
        img: getSiteImage(s.name),
        rating: 4.9 - i * 0.1,
      }))
    : [
        { name: "Bindhyabasini Temple", location: "Pokhara, Nepal", img: SITE_IMAGES["Bindhyabasini Temple"], rating: 4.9 },
        { name: "Lumbini", location: "Rupandehi, Nepal", img: SITE_IMAGES["Lumbini"], rating: 4.8 },
        { name: "Patan Durbar Square", location: "Lalitpur, Nepal", img: SITE_IMAGES["Patan Durbar Square"], rating: 4.7 },
      ];

  const recent = [
    { name: "Bindhyabasini Temple", location: "Pokhara, Kaski", img: getSiteImage("Bindhyabasini Temple"), time: "2h ago" },
    { name: "Patan Durbar Square", location: "Lalitpur, Nepal", img: getSiteImage("Patan Durbar Square"), time: "Yesterday" },
  ];

  const displayName = user?.name || "Explorer";
  const userInitials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "EX";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 18) return "Good Afternoon,";
    return "Good Evening,";
  };

  const quickActions = [
    { label: "AI Scan", icon: Camera, color: "bg-[#23351F]", textColor: "text-white", action: onScan },
    { label: "Audio Guide", icon: Volume2, color: "bg-[#EAF6DD]", textColor: "text-[#69A20D]", action: () => onNav("audio") },
    { label: "Story Mode", icon: BookOpen, color: "bg-[#CAE5B1]/50", textColor: "text-[#23351F]", action: () => onNav("story") },
    { label: "Map View", icon: MapPin, color: "bg-[#EEF1F3]", textColor: "text-[#69A20D]", action: () => onNav("map") },
  ];

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      {/* Top Header */}
      <div className="px-5 pt-12 sm:pt-14 pb-4 bg-gradient-to-b from-[#EAF6DD]/60 via-[#F7F9F6]/40 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#5F6B5E] text-xs font-semibold">{getGreeting()}</p>
            <h1 className="text-xl font-black text-[#222E1C] flex items-center gap-1.5 font-display">
              {displayName}
              <span className="inline-block w-2 h-2 rounded-full bg-[#69A20D]" />
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNav("notifications")}
              className="w-10 h-10 rounded-2xl bg-white border border-[#E4E7EB] flex items-center justify-center relative shadow-xs hover:bg-[#EAF6DD] transition-all"
            >
              <Bell size={18} className="text-[#222E1C]" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#69A20D] rounded-full border-2 border-white" />
            </button>
            <button
              onClick={() => onNav("profile")}
              className="w-10 h-10 rounded-2xl bg-[#23351F] flex items-center justify-center shadow-md hover:bg-[#172514] transition-all"
            >
              <span className="text-white text-xs font-black tracking-wider">{userInitials}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="px-5 mb-5">
        <button onClick={() => onNav("search")} className="w-full flex items-center gap-3 bg-white border border-[#E4E7EB] rounded-2xl px-4 py-3.5 shadow-xs hover:border-[#69A20D]/60 transition-all text-left">
          <Search size={18} className="text-[#69A20D]" />
          <span className="text-[#5F6B5E] text-sm flex-1 font-medium">Search heritage sites, temples, history...</span>
          <div className="bg-[#EAF6DD] rounded-xl p-1.5">
            <Filter size={14} className="text-[#23351F]" />
          </div>
        </button>
      </div>

      {/* AI Camera Scanner Hero Card */}
      <div className="px-5 mb-6">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={onScan}
          className="w-full rounded-3xl p-5 relative overflow-hidden shadow-lg cursor-pointer"
          style={{ background: "linear-gradient(135deg, #23351F 0%, #354f2f 60%, #172514 100%)" }}
        >
          {/* Subtle Grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#69A20D_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1 pr-3">
              <div className="inline-flex items-center gap-1.5 bg-[#69A20D]/25 border border-[#69A20D]/50 rounded-full px-2.5 py-0.5 mb-2">
                <Sparkles size={10} className="text-[#CAE5B1]" />
                <span className="text-[#CAE5B1] text-[10px] font-bold tracking-wider uppercase">OpenCLIP AI Powered</span>
              </div>
              <h3 className="text-white text-lg font-black leading-tight font-display">Identify Heritage Site</h3>
              <p className="text-white/80 text-xs mt-1">Point your camera or upload a photo for instant history & audio guide</p>
            </div>

            <div className="relative flex-shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#69A20D]/30 blur-xl rounded-full" />
              <MascotSVG size={64} animate />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between relative z-10">
            <span className="text-white/90 text-xs font-bold flex items-center gap-1.5">
              <Camera size={14} className="text-[#CAE5B1]" /> Open Live Scanner
            </span>
            <div className="w-8 h-8 rounded-full bg-[#69A20D] text-white flex items-center justify-center shadow-md">
              <ChevronRight size={16} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Access Actions Bar */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map(act => (
            <motion.button
              key={act.label}
              whileTap={{ scale: 0.95 }}
              onClick={act.action}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#E4E7EB] shadow-xs hover:shadow-sm hover:border-[#69A20D]/40 transition-all text-center"
            >
              <div className={`w-11 h-11 rounded-2xl ${act.color} flex items-center justify-center shadow-xs`}>
                <act.icon size={20} className={act.textColor} />
              </div>
              <span className="text-[#222E1C] text-[11px] font-bold leading-tight">{act.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Heritage Categories */}
      <div className="mb-5">
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-[#222E1C] font-display">Categories</h2>
        </div>
        <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide">
          {chips.map(c => (
            <Chip key={c} label={c} active={activeChip === c} onClick={() => setActiveChip(c)} />
          ))}
        </div>
      </div>

      {/* Featured Heritage Sites */}
      <div className="mb-6">
        <div className="px-5 mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#222E1C] font-display">Featured Heritage</h2>
            <p className="text-[#5F6B5E] text-xs font-medium">Explore top UNESCO destinations</p>
          </div>
          <button onClick={() => onNav("explore")} className="text-[#69A20D] text-xs font-black flex items-center gap-1 hover:underline">
            See all <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-3.5 px-5 overflow-x-auto scrollbar-hide py-1">
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : featured.map(f => (
                <HeritageCard
                  key={f.name}
                  {...f}
                  onClick={() => {
                    onSelectSite(f.name);
                    onNav("details");
                  }}
                />
              ))}
        </div>
      </div>

      {/* Daily Cultural Discovery Highlight Card */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-r from-[#EAF6DD] to-white border border-[#CAE5B1] rounded-3xl p-4 flex items-center gap-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#23351F] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Compass size={22} className="text-[#CAE5B1]" />
          </div>
          <div className="flex-1">
            <Badge label="Daily Discovery" color="gold" />
            <h4 className="text-[#222E1C] text-xs font-black mt-1">Valley of Gods & Temples</h4>
            <p className="text-[#5F6B5E] text-[11px] mt-0.5 line-clamp-1">Did you know Kathmandu has 7 UNESCO World Heritage sites?</p>
          </div>
          <button onClick={() => onNav("explore")} className="text-[#69A20D] text-xs font-black underline">
            Read
          </button>
        </div>
      </div>

      {/* Recent Visits History */}
      <div className="px-5 mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-[#222E1C] font-display">Recent Scans & Visits</h2>
          <button onClick={() => onNav("history")} className="text-[#69A20D] text-xs font-black hover:underline">
            View history
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {recent.map(r => (
            <button
              key={r.name}
              onClick={() => {
                onSelectSite(r.name);
                onNav("details");
              }}
              className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#E4E7EB] shadow-xs hover:shadow-sm hover:border-[#69A20D]/40 transition-all text-left group"
            >
              <img src={r.img} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-[#222E1C] text-sm font-bold group-hover:text-[#69A20D] transition-colors">{r.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#5F6B5E] text-xs">{r.location}</span>
                  <span className="text-[#A7B1A7] text-xs">·</span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-[#5F6B5E]" />
                    <span className="text-[#5F6B5E] text-[11px]">{r.time}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#5F6B5E] group-hover:text-[#69A20D] transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="home" onNav={onNav} />
    </div>
  );
}

function CameraScreen({ onScan, onBack, onFileSelect }: { onScan: () => void; onBack: () => void; onFileSelect: (file: File) => void }) {
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize live camera hardware on mount
  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false,
        });

        if (isMounted) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setCameraActive(true);
        } else {
          stream.getTracks().forEach(t => t.stop());
        }
      } catch (err: unknown) {
        console.warn("Live camera access failed, falling back to file picker:", err);
        if (isMounted) {
          setCameraActive(false);
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setScanning(true);
      setTimeout(onScan, 600);
    }
  };

  const handleShutter = () => {
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onFileSelect(capturedFile);
            setScanning(true);
            setTimeout(onScan, 600);
          } else {
            fileInputRef.current?.click();
          }
        }, 'image/jpeg', 0.9);
        return;
      }
    }
    // Fallback to file/camera picker if live stream not active
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full min-h-[852px] bg-black flex flex-col relative overflow-hidden">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera View Area */}
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${cameraActive ? "opacity-100" : "opacity-0"}`}
        />

        {/* Fallback image view when camera is initializing or permission pending */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <img src="https://images.unsplash.com/photo-1761048803183-fc870f25e221?w=400&h=852&fit=crop&auto=format"
              alt="camera preview" className="w-full h-full object-cover opacity-40 absolute inset-0" />
            <div className="relative z-10 bg-black/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl max-w-[300px]">
              <Camera size={40} className="text-[#D4A017] mx-auto mb-3" />
              <p className="text-white text-sm font-bold mb-1">Identify Heritage Site</p>
              <p className="text-white/60 text-xs mb-4">Tap to take a photo or upload an image from gallery</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#2C3E8F] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-lg w-full"
              >
                Upload / Take Photo
              </button>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-16 pb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2">
          <p className="text-white text-xs font-semibold">Point at a heritage site</p>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
          <Plus size={18} className="text-white" />
        </button>
      </div>

      {/* Reticle Frame */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="relative w-64 h-64">
          {[["top-0 left-0 border-t-2 border-l-2", "rounded-tl-2xl"],
            ["top-0 right-0 border-t-2 border-r-2", "rounded-tr-2xl"],
            ["bottom-0 left-0 border-b-2 border-l-2", "rounded-bl-2xl"],
            ["bottom-0 right-0 border-b-2 border-r-2", "rounded-br-2xl"]
          ].map(([pos, round], i) => (
            <div key={i} className={`absolute w-10 h-10 border-[#D4A017] ${pos} ${round}`} />
          ))}
          <motion.div
            className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent"
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <MascotSVG size={60} animate />
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 px-5 pb-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Globe size={20} className="text-white" />
            </div>
            <span className="text-white/80 text-[10px] font-semibold">Gallery</span>
          </button>

          <motion.button whileTap={{ scale: 0.9 }}
            onClick={handleShutter}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-[#2C3E8F] flex items-center justify-center">
              <Camera size={28} className="text-white" />
            </div>
            {scanning && <motion.div className="absolute inset-0 rounded-full border-2 border-[#D4A017]"
              animate={{ scale: [1, 1.3], opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />}
          </motion.button>

          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Plus size={20} className="text-white" />
            </div>
            <span className="text-white/80 text-[10px] font-semibold">Upload</span>
          </button>
        </div>
        <p className="text-white/70 text-xs text-center font-medium">Tap camera to scan or select a photo from gallery</p>
      </div>
    </div>
  );
}

function ScanningScreen({ onDone, imageFile, onRecognitionResult }: { onDone: () => void; imageFile: File | null; onRecognitionResult: (result: RecognitionResult | null, error?: string) => void }) {
  const [progress, setProgress] = useState(0);
  const steps = ["Uploading image...", "Analyzing architecture...", "Cross-referencing heritage database...", "Generating insights..."];
  const [stepIdx, setStepIdx] = useState(0);
  const recognitionStarted = useRef(false);

  // Start real recognition
  useEffect(() => {
    if (!imageFile || recognitionStarted.current) return;
    recognitionStarted.current = true;

    apiRecognizeSite(imageFile)
      .then(result => {
        onRecognitionResult(result);
      })
      .catch(err => {
        onRecognitionResult(null, err.message || 'Recognition failed');
      });
  }, [imageFile, onRecognitionResult]);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onDone, 400); return 100; }
        return p + 2;
      });
      setStepIdx(Math.floor((progress / 100) * steps.length));
    }, 50);
    return () => clearInterval(interval);
  }, [onDone, progress]);
  return (
    <div className="h-full min-h-[852px] flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #23351F 0%, #354f2f 60%, #172514 100%)" }}>
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full border border-[#69A20D]/20"
          style={{ width: 100 + i * 60, height: 100 + i * 60 }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8">
        <div className="relative">
          <motion.div className="absolute inset-0 bg-[#69A20D]/30 blur-2xl rounded-full"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          <MascotSVG size={100} animate />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-white mb-2 font-display">Ara is analyzing...</h2>
          <motion.p key={stepIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-white/80 text-sm font-medium">{steps[Math.min(stepIdx, steps.length - 1)]}</motion.p>
        </div>
        <div className="w-full">
          <div className="flex justify-between mb-2">
            <span className="text-white/70 text-xs">AI Vision Processing</span>
            <span className="text-[#CAE5B1] text-xs font-black">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/15">
            <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #69A20D, #CAE5B1)", width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex gap-6">
          {["UNESCO DB", "OpenCLIP AI", "Stories Engine"].map((db, i) => (
            <div key={db} className="flex flex-col items-center gap-1">
              <motion.div className={`w-8 h-8 rounded-full flex items-center justify-center ${progress > (i + 1) * 30 ? "bg-[#69A20D]" : "bg-white/10"}`}
                animate={progress > (i + 1) * 30 ? { scale: [1, 1.2, 1] } : {}}>
                <Check size={14} className="text-white" />
              </motion.div>
              <span className="text-white/60 text-[9px] font-semibold text-center">{db}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({ onNav, onBack, recognitionResult, recognitionError, onSelectSite }: { onNav: (s: Screen) => void; onBack: () => void; recognitionResult: RecognitionResult | null; recognitionError?: string; onSelectSite: (name: string) => void }) {
  const siteName = recognitionResult?.siteName || "Unknown Site";
  const confidence = recognitionResult?.confidence || 0;
  const isConfident = recognitionResult?.isConfident ?? false;
  const metadata = recognitionResult?.metadata;
  const description = metadata?.description || `Explore the rich cultural history of ${siteName}.`;
  const location = metadata?.location || "Nepal";
  const confidencePercent = (confidence * 100).toFixed(1);

  if (recognitionError) {
    return (
      <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
        <NavBar title="Recognition" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-5 border border-red-200">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-[#222E1C] text-xl font-black mb-2 font-display">Recognition Failed</h2>
          <p className="text-[#5F6B5E] text-sm leading-relaxed mb-6">{recognitionError}</p>
          <PrimaryButton label="Try Again" full icon={<RotateCcw size={14} />} onClick={onBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      {/* Hero */}
      <div className="relative h-64 bg-[#EEF1F3] flex-shrink-0">
        <img src={getSiteImage(siteName)}
          alt={siteName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F9F6] via-black/10 to-black/40" />
        <button onClick={onBack} className="absolute top-14 left-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="absolute top-14 right-5 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
          <Share2 size={18} className="text-white" />
        </div>
      </div>
      <div className="px-5 -mt-6 relative z-10">
        {/* Confidence pill */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-[#EAF6DD] border border-[#CAE5B1] rounded-full px-3 py-1.5">
            <Check size={12} className="text-[#69A20D]" />
            <span className="text-xs font-bold text-[#23351F]">{confidencePercent}% Match</span>
          </div>
          {isConfident && <Badge label="UNESCO Identified" color="gold" />}
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-2xl font-black text-[#222E1C] leading-tight mb-1 font-display">
          {siteName}
        </motion.h1>
        <div className="flex items-center gap-1 mb-4">
          <MapPin size={12} className="text-[#69A20D]" />
          <span className="text-[#5F6B5E] text-sm font-medium">{location}</span>
        </div>
        {/* AI summary with Audio Narration */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 mb-5 border border-[#E4E7EB] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MascotSVG size={28} />
              <span className="text-[#23351F] text-xs font-black">Ara says</span>
            </div>
            <button
              onClick={() => {
                onSelectSite(siteName);
                onNav("audio");
              }}
              className="flex items-center gap-1.5 bg-[#23351F] text-white rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm hover:bg-[#172514] transition-all"
            >
              <Volume2 size={12} className="text-[#69A20D]" />
              <span>Listen Audio</span>
            </button>
          </div>
          <p className="text-[#222E1C] text-sm leading-relaxed font-medium">
            {description}
          </p>
        </div>
        {/* All scores */}
        {recognitionResult?.allScores && recognitionResult.allScores.length > 0 && (
          <div className="mb-5 bg-white p-4 rounded-3xl border border-[#E4E7EB]">
            <p className="text-[#222E1C] text-xs font-black mb-2">Recognition Confidence Scores</p>
            <div className="flex flex-col gap-2">
              {recognitionResult.allScores.map(([name, score]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="text-[#222E1C] text-xs font-bold flex-1">{name}</span>
                  <div className="w-24">
                    <ProgressBar value={score * 100} color={name === siteName ? '#69A20D' : '#A7B1A7'} />
                  </div>
                  <span className="text-[#5F6B5E] text-[10px] w-10 text-right font-semibold">{(score * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Story Mode", icon: BookOpen, color: "#23351F", bg: "#EAF6DD", screen: "story" as Screen },
            { label: "Audio Guide", icon: Volume2, color: "#69A20D", bg: "#CAE5B1/40", screen: "audio" as Screen },
            { label: "Explore", icon: Compass, color: "#23351F", bg: "#EEF1F3", screen: "details" as Screen },
          ].map(({ label, icon: Icon, color, bg, screen }) => (
            <motion.button key={label} whileTap={{ scale: 0.95 }}
              onClick={() => { onSelectSite(siteName); onNav(screen); }}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl py-4 border border-[#E4E7EB] shadow-xs hover:border-[#69A20D]/40 transition-all">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-[#222E1C] text-xs font-bold">{label}</span>
            </motion.button>
          ))}
        </div>
        <div className="flex gap-3 mb-8">
          <GhostButton label="Save Place" full onClick={() => onNav("saved")} />
          <PrimaryButton label="Navigate" full icon={<Navigation size={14} />} onClick={() => onNav("map")} />
        </div>
      </div>
    </div>
  );
}

function DetailsScreen({ onNav, onBack, selectedSite }: { onNav: (s: Screen) => void; onBack: () => void; selectedSite: string }) {
  const [tab, setTab] = useState("Overview");
  const tabs = ["Overview", "History", "Gallery", "Reviews"];
  const [site, setSite] = useState<HeritageSite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedSite) { setLoading(false); return; }
    setLoading(true);
    getHeritageSiteByName(selectedSite)
      .then(data => setSite(data))
      .catch(() => setSite(null))
      .finally(() => setLoading(false));
  }, [selectedSite]);

  const displayName = site?.name || selectedSite || "Heritage Site";
  const displayLocation = site?.location || "Nepal";
  const displayDesc = site?.description || `Explore the rich cultural history of ${displayName}.`;
  const displayTags = site?.tags || ["heritage", "cultural"];

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      <div className="relative h-56 bg-[#EEF1F3] flex-shrink-0">
        <img src={getSiteImage(displayName)}
          alt={displayName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F9F6] via-transparent to-black/30" />
        <div className="absolute top-14 left-5 right-5 flex justify-between">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex gap-2">
            {[Bookmark, Share2].map((Icon, i) => (
              <button key={i} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Icon size={18} className="text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>
      {loading ? (
        <div className="px-5 pt-4"><SkeletonCard /><SkeletonCard /></div>
      ) : (
        <div className="px-5 -mt-4 relative z-10">
          <div className="flex gap-2 mb-2">
            {displayTags.slice(0, 2).map(t => (
              <Badge key={t} label={t.replace(/_/g, ' ')} color="gold" />
            ))}
          </div>
          <h1 className="text-2xl font-black text-[#222E1C] mb-1 font-display">{displayName}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1"><Star size={12} className="text-[#69A20D] fill-[#69A20D]" /><span className="text-sm font-bold text-[#222E1C]">4.8</span></div>
            <span className="text-[#A7B1A7] text-xs">·</span>
            <div className="flex items-center gap-1"><MapPin size={12} className="text-[#69A20D]" /><span className="text-[#5F6B5E] text-xs font-medium">{displayLocation}</span></div>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${tab === t ? "bg-[#23351F] text-white shadow-sm" : "bg-[#EEF1F3] text-[#5F6B5E] border border-[#E4E7EB]"}`}>{t}</button>
            ))}
          </div>
          <div className="text-[#222E1C] text-sm leading-relaxed mb-5 bg-white p-4 rounded-3xl border border-[#E4E7EB] shadow-xs">
            {displayDesc}
            {site?.historicalSignificance && (
              <p className="mt-3 text-[#5F6B5E] border-t border-[#E4E7EB] pt-3">{site.historicalSignificance}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Open Hours", val: "4 AM – 9 PM", icon: Clock },
              { label: "Entry Fee", val: "NPR 400", icon: Info },
              { label: "Best Time", val: "Oct – Mar", icon: Wind },
              { label: "Duration", val: "2–3 Hours", icon: Coffee },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl p-3 border border-[#E4E7EB] flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 bg-[#EAF6DD] rounded-xl flex items-center justify-center border border-[#CAE5B1]">
                  <Icon size={14} className="text-[#69A20D]" />
                </div>
                <div>
                  <p className="text-[#5F6B5E] text-[10px] font-medium">{label}</p>
                  <p className="text-[#222E1C] text-xs font-bold">{val}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mb-8">
            <GhostButton label="Story Mode" full onClick={() => onNav("story")} />
            <PrimaryButton label="Audio Guide" full icon={<Volume2 size={14} />} onClick={() => onNav("audio")} />
          </div>
        </div>
      )}
    </div>
  );
}

function StoryScreen({ onBack, selectedSite }: { onBack: () => void; selectedSite: string }) {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [storyError, setStoryError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSite) { setLoading(false); return; }
    setLoading(true);
    setStoryError(null);
    generateStory(selectedSite)
      .then(data => setStoryData(data))
      .catch(err => setStoryError(err.message || 'Failed to generate story'))
      .finally(() => setLoading(false));
  }, [selectedSite]);

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      <div className="px-5 pt-12 sm:pt-14 pb-3 flex items-center justify-between bg-white border-b border-[#E4E7EB]">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-[#69A20D]" />
          <span className="text-[#222E1C] text-sm font-black font-display">Heritage Story</span>
        </div>
        <Badge label={storyData?.source?.includes('Grok') ? 'AI Generated' : 'Catalog'} color="gold" />
      </div>
      <div className="px-5 flex-1 pt-4 pb-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <MascotSVG size={80} animate />
            <p className="text-[#23351F] text-sm font-bold mt-4">Ara is crafting your story...</p>
            <p className="text-[#5F6B5E] text-xs mt-1">Generating narrative for {selectedSite}</p>
          </div>
        ) : storyError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle size={40} className="text-red-500 mb-3" />
            <p className="text-[#222E1C] font-bold mb-2 font-display">Couldn't generate story</p>
            <p className="text-[#5F6B5E] text-sm mb-4">{storyError}</p>
            <PrimaryButton label="Try Again" onClick={() => { setLoading(true); generateStory(selectedSite).then(setStoryData).catch(e => setStoryError(e.message)).finally(() => setLoading(false)); }} />
          </div>
        ) : storyData ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="relative rounded-3xl overflow-hidden h-52 mb-5 bg-[#EEF1F3] shadow-sm border border-[#E4E7EB]">
              <img src={getSiteImage(selectedSite)} alt={storyData.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                <MascotSVG size={36} animate />
                <div className="bg-black/50 backdrop-blur-md rounded-2xl px-3 py-2 flex-1 border border-white/20">
                  <p className="text-white text-xs font-semibold">Ara narrates the legends</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-[#E4E7EB] shadow-xs mb-5">
              <h2 className="text-2xl font-black text-[#222E1C] mb-3 font-display">{storyData.title}</h2>
              <p className="text-[#5F6B5E] text-sm leading-relaxed">{storyData.narrative}</p>
            </div>
            {storyData.highlights && storyData.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[#222E1C] text-sm font-black mb-3 font-display">Historical Highlights</h3>
                <div className="flex flex-col gap-2.5">
                  {storyData.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[#EAF6DD]/60 rounded-2xl p-3.5 border border-[#CAE5B1]">
                      <div className="w-6 h-6 rounded-full bg-[#69A20D] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Star size={10} />
                      </div>
                      <p className="text-[#222E1C] text-sm font-medium leading-normal">{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {storyData.location && (
              <div className="flex items-center gap-1.5 mb-4">
                <MapPin size={14} className="text-[#69A20D]" />
                <span className="text-[#5F6B5E] text-xs font-semibold">{storyData.location}</span>
              </div>
            )}
            <div className="text-[#A7B1A7] text-[10px] text-center mb-5 font-medium">
              Source: {storyData.source}
            </div>
            <PrimaryButton label="Done" full onClick={onBack} />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

function AudioGuideScreen({ onBack, selectedSite }: { onBack: () => void; selectedSite: string }) {
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive Voice Chat & Grok Key state
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('grok_api_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatGuideMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const siteTitle = storyData?.title || selectedSite || "Heritage Site";

  // Initial load narrative
  useEffect(() => {
    if (!selectedSite) {
      setLoading(false);
      return;
    }
    setLoading(true);
    generateStory(selectedSite)
      .then(data => {
        setStoryData(data);
        const welcomeText = `Namaste! I am Ara, your human guide for ${selectedSite}. ${data.narrative}`;
        setChatHistory([{ sender: 'ara', text: welcomeText }]);
      })
      .catch(() => {
        const welcomeText = `Namaste! I am Ara, your personal heritage guide for ${selectedSite || 'this site'}. Ask me anything about its legends, history, or secrets!`;
        setChatHistory([{ sender: 'ara', text: welcomeText }]);
      })
      .finally(() => setLoading(false));
  }, [selectedSite]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  // Handle SpeechSynthesis audio playback
  const speakText = useCallback((text: string, playbackRate: number) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen')));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        setPlaying(false);
        setProgress(100);
      };

      utterance.onboundary = (e) => {
        if (text.length > 0) {
          const pct = Math.min(100, Math.round((e.charIndex / text.length) * 100));
          setProgress(pct);
        }
      };

      window.speechSynthesis.speak(utterance);
      setPlaying(true);
    }
  }, []);

  // Save Grok Key
  const handleSaveKey = () => {
    const trimmed = keyInput.trim();
    setApiKey(trimmed);
    localStorage.setItem('grok_api_key', trimmed);
    setShowKeyModal(false);
  };

  // Interactive Message Sender
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    setInputQuery('');
    const newHistory: ChatGuideMessage[] = [...chatHistory, { sender: 'user', text: query }];
    setChatHistory(newHistory);
    setIsThinking(true);

    try {
      const res = await chatWithGuide(selectedSite || 'Heritage Site', query, newHistory, apiKey);
      const araReply = res.reply;
      setChatHistory([...newHistory, { sender: 'ara', text: araReply }]);
      speakText(araReply, rate);
    } catch (err) {
      const fallbackReply = `I'm right here with you at ${selectedSite || 'this site'}! Ask me about its ancient history, builders, or hidden legends.`;
      setChatHistory([...newHistory, { sender: 'ara', text: fallbackReply }]);
      speakText(fallbackReply, rate);
    } finally {
      setIsThinking(false);
    }
  };

  // Web Speech Recognition
  const toggleListening = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Voice speech recognition is not supported in this browser. Please type your question.');
        return;
      }

      if (isListening) {
        setIsListening(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          if (transcript) {
            handleSendMessage(transcript);
          }
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const togglePlay = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (playing) {
        window.speechSynthesis.pause();
        setPlaying(false);
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setPlaying(true);
        } else {
          const lastAraMessage = [...chatHistory].reverse().find(m => m.sender === 'ara');
          speakText(lastAraMessage?.text || narrative, rate);
        }
      }
    }
  };

  const handleRateChange = () => {
    const nextRate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1;
    setRate(nextRate);
    if (playing) {
      const lastAraMessage = [...chatHistory].reverse().find(m => m.sender === 'ara');
      speakText(lastAraMessage?.text || narrative, nextRate);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const suggestions = [
    "Tell me a secret legend",
    "Who built this monument?",
    "What is the architectural style?",
    "Best spots for photos?",
  ];

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px] relative">
      {/* Top Bar */}
      <div className="px-5 pt-12 sm:pt-14 pb-3 flex items-center justify-between bg-white border-b border-[#E4E7EB] z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[#222E1C] text-base font-black font-display block leading-tight">Ara Human Guide</span>
            <span className="text-[#5F6B5E] text-[10px] font-semibold">Interactive Voice & AI Companion</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 bg-[#EAF6DD] text-[#23351F] border border-[#CAE5B1] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#CAE5B1]/50 transition-all"
          >
            <Key size={12} className="text-[#69A20D]" />
            <span>{apiKey ? (apiKey.startsWith('AIza') ? 'Gemini Active' : 'Grok Active') : 'Set API Key'}</span>
          </button>
          <button
            onClick={handleRateChange}
            className="bg-[#EEF1F3] text-[#222E1C] border border-[#E4E7EB] text-xs font-bold px-2.5 py-1.5 rounded-full"
          >
            {rate}x
          </button>
        </div>
      </div>

      {/* Guide Hero & Voice Status */}
      <div className="mx-5 my-3 bg-white rounded-3xl p-4 border border-[#E4E7EB] shadow-xs flex items-center gap-4 relative overflow-hidden">
        <div className="relative">
          <MascotSVG size={54} animate={playing || isListening} />
          {playing && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#69A20D] rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-[#222E1C] font-black text-sm font-display">{selectedSite || "Heritage Site"}</h2>
            <Badge
              label={apiKey ? (apiKey.startsWith('AIza') ? "Gemini 2.0" : "xAI Grok") : "Local AI"}
              color={apiKey ? "gold" : "sand"}
            />
          </div>
          <p className="text-[#5F6B5E] text-xs font-medium leading-tight">
            {isListening ? "🎙️ Ara is listening..." : playing ? "🗣️ Ara is speaking..." : isThinking ? "🧠 Ara is thinking..." : "Ask Ara anything aloud or type below!"}
          </p>

          {/* Animated Waveform */}
          <div className="flex items-center gap-1 h-4 mt-2">
            {[0.4, 0.9, 0.5, 0.7, 1.0, 0.6, 0.8, 0.4, 0.9, 0.5].map((h, i) => (
              <motion.div
                key={i}
                className={`w-1 rounded-full ${playing ? 'bg-[#69A20D]' : isListening ? 'bg-red-500' : 'bg-[#E4E7EB]'}`}
                animate={playing || isListening ? { height: ["20%", `${h * 100}%`, "20%"] } : { height: "20%" }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.06 }}
              />
            ))}
          </div>
        </div>

        {/* Play Pause Button */}
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-2xl bg-[#23351F] text-white flex items-center justify-center shadow-md hover:bg-[#172514] transition-all flex-shrink-0"
        >
          {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5 fill-white" />}
        </button>
      </div>

      {/* Interactive Dialogue History */}
      <div className="px-5 flex-1 overflow-y-auto max-h-[380px] scrollbar-hide py-2 flex flex-col gap-3">
        {chatHistory.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ara' && (
              <div className="w-8 h-8 rounded-full bg-[#EAF6DD] border border-[#CAE5B1] flex items-center justify-center flex-shrink-0 mt-1">
                <MascotSVG size={22} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-3xl p-3.5 text-xs leading-relaxed font-medium shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#23351F] text-white rounded-tr-xs'
                  : 'bg-white text-[#222E1C] border border-[#E4E7EB] rounded-tl-xs'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-[#5F6B5E] text-xs py-2 bg-white rounded-2xl p-3 border border-[#E4E7EB] max-w-[60%]">
            <Loader2 size={14} className="animate-spin text-[#69A20D]" />
            <span>Ara is consulting history...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Interactive Suggestion Chips */}
      <div className="px-5 my-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => handleSendMessage(s)}
              className="bg-white border border-[#CAE5B1] text-[#23351F] text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-xs hover:bg-[#EAF6DD] transition-all flex items-center gap-1"
            >
              <Sparkles size={10} className="text-[#69A20D]" />
              <span>{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice & Input Action Bar */}
      <div className="p-4 bg-white border-t border-[#E4E7EB]">
        <div className="flex items-center gap-2">
          {/* Push-to-Talk Mic Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#EAF6DD] text-[#23351F] border border-[#CAE5B1]'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} className="text-[#69A20D]" />}
          </motion.button>

          {/* Text Input */}
          <div className="flex-1 flex items-center gap-2 bg-[#EEF1F3] rounded-2xl px-4 py-2.5 border border-[#E4E7EB] focus-within:border-[#69A20D]">
            <input
              type="text"
              placeholder={isListening ? "Listening to your voice..." : "Ask Ara about this site..."}
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 text-xs text-[#222E1C] placeholder-[#A7B1A7] bg-transparent outline-none font-medium"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isThinking}
              className="w-8 h-8 rounded-xl bg-[#23351F] text-white flex items-center justify-center disabled:opacity-30 hover:bg-[#172514] transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Gemini / Grok API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#E4E7EB] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Key size={18} className="text-[#69A20D]" />
                  <h3 className="text-[#222E1C] font-black text-base font-display">Configure AI API Key</h3>
                </div>
                <button onClick={() => setShowKeyModal(false)}><X size={18} className="text-[#5F6B5E]" /></button>
              </div>
              <p className="text-[#5F6B5E] text-xs leading-relaxed mb-4">
                Enter your <b>Google Gemini API Key</b> (`AIza...`) or <b>xAI Grok API Key</b> (`xai-...`) to power Ara with live conversational AI.
              </p>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="AIza... or xai-..."
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  className="w-full bg-[#EEF1F3] border border-[#E4E7EB] rounded-2xl px-4 py-3 text-xs text-[#222E1C] outline-none focus:border-[#69A20D]"
                />
              </div>
              <div className="flex gap-2">
                <GhostButton label="Cancel" full onClick={() => setShowKeyModal(false)} />
                <PrimaryButton label="Save Key" full onClick={handleSaveKey} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MapScreen({ onNav, onBack, onSelectSite }: { onNav: (s: Screen) => void; onBack: () => void; onSelectSite?: (name: string) => void }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const heritagePlaces = [
    { name: "Patan Durbar Square", location: "Lalitpur, Nepal", lat: 27.6727, lng: 85.3253, rating: 4.8, dist: "1.2 km" },
    { name: "Bindhyabasini Temple", location: "Pokhara, Nepal", lat: 28.2380, lng: 83.9856, rating: 4.9, dist: "Pokhara" },
    { name: "Lumbini", location: "Rupandehi, Nepal", lat: 27.4840, lng: 83.2760, rating: 4.9, dist: "Lumbini" },
    { name: "Pashupatinath Temple", location: "Kathmandu, Nepal", lat: 27.7104, lng: 85.3487, rating: 4.9, dist: "2.1 km" },
    { name: "Boudhanath Stupa", location: "Kathmandu Valley", lat: 27.7215, lng: 85.3620, rating: 4.8, dist: "3.5 km" },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let map: any = null;

    async function initLeafletMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Import Leaflet dynamically
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([27.6727, 85.3253], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersRef.current = [];
      heritagePlaces.forEach((place, index) => {
        const customIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `<div style="background-color:#23351F; color:white; border:2px solid #69A20D; border-radius:50%; width:32px; height:32px; display:flex; items-center; justify-content:center; font-weight:bold; font-size:12px; box-shadow:0 4px 10px rgba(0,0,0,0.15);">${index + 1}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedIdx(index);
          map.flyTo([place.lat, place.lng], 14, { duration: 1 });
        });
        markersRef.current.push(marker);
      });

      // Add User Geolocation Pulse if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;
            const userIcon = L.divIcon({
              className: 'user-location-pin',
              html: `<div style="width:16px; height:16px; background-color:#69A20D; border:3px solid white; border-radius:50%; box-shadow:0 0 10px rgba(105,162,13,0.8);"></div>`,
              iconSize: [16, 16],
            });
            L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup("You are here");
          },
          () => {},
          { timeout: 5000 }
        );
      }

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }

    initLeafletMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSelectPlace = (index: number) => {
    setSelectedIdx(index);
    const place = heritagePlaces[index];
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lng], 14, { duration: 1 });
    }
  };

  const selectedPlace = heritagePlaces[selectedIdx];

  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      <div className="px-5 pt-12 sm:pt-14 pb-3 flex items-center gap-3 bg-white border-b border-[#E4E7EB]">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
          <ArrowLeft size={18} />
        </button>
        <span className="text-[#222E1C] text-base font-black flex-1 font-display">Interactive OpenStreetMap</span>
        <button onClick={() => onNav("search")} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
          <Search size={16} />
        </button>
      </div>

      {/* Real Map Container */}
      <div className="mx-5 my-4 relative rounded-3xl overflow-hidden border border-[#E4E7EB] shadow-xs" style={{ height: 360 }}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />
        {!mapLoaded && (
          <div className="absolute inset-0 bg-[#EEF1F3] flex items-center justify-center gap-2 text-sm text-[#23351F] font-bold">
            <Loader2 size={18} className="animate-spin text-[#69A20D]" />
            <span>Loading OpenStreetMap...</span>
          </div>
        )}
      </div>

      {/* Selected place card */}
      <div className="px-5">
        <motion.div key={selectedPlace.name} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-4 border border-[#E4E7EB] shadow-xs flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF1F3] overflow-hidden flex-shrink-0">
            <img src={getSiteImage(selectedPlace.name)} alt={selectedPlace.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-[#222E1C] font-black text-sm">{selectedPlace.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1"><Star size={10} className="text-[#69A20D] fill-[#69A20D]" /><span className="text-xs font-bold text-[#222E1C]">{selectedPlace.rating}</span></div>
              <span className="text-[#A7B1A7] text-xs">·</span>
              <span className="text-[#5F6B5E] text-xs font-medium">{selectedPlace.location}</span>
            </div>
          </div>
          <PrimaryButton label="Explore" onClick={() => { onSelectSite?.(selectedPlace.name); onNav("details"); }} icon={<Navigation size={14} />} />
        </motion.div>

        {/* List */}
        <h3 className="text-[#222E1C] text-sm font-black mb-3 font-display">All Sites on Map ({heritagePlaces.length})</h3>
        <div className="flex flex-col gap-2 pb-6">
          {heritagePlaces.map((p, i) => (
            <button key={p.name} onClick={() => handleSelectPlace(i)}
              className={`flex items-center gap-3 rounded-2xl p-3 border transition-all text-left ${selectedIdx === i ? "bg-[#EAF6DD] border-[#CAE5B1]" : "bg-white border-[#E4E7EB]"}`}>
              <div className="w-10 h-10 rounded-xl bg-[#EEF1F3] overflow-hidden flex-shrink-0">
                <img src={getSiteImage(p.name)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${selectedIdx === i ? "text-[#23351F]" : "text-[#222E1C]"}`}>{p.name}</p>
                <p className="text-[#5F6B5E] text-xs">{p.location}</p>
              </div>
              <MapPin size={16} className={selectedIdx === i ? "text-[#69A20D]" : "text-[#5F6B5E]"} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExploreScreen({ onNav, onSelectSite }: { onNav: (s: Screen) => void; onSelectSite: (name: string) => void }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Temples", "Buddhist", "UNESCO", "Palaces"];
  const [apiSites, setApiSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      <div className="px-5 pt-12 sm:pt-14 pb-3">
        <h1 className="text-2xl font-black text-[#222E1C] mb-1 font-display">Explore Heritage</h1>
        <p className="text-[#5F6B5E] text-sm">Discover World Heritage sites and ancient legends</p>
      </div>
      {/* Hero banner */}
      <div className="mx-5 rounded-3xl overflow-hidden h-36 relative mb-5 bg-[#23351F] shadow-md">
        <img src="https://images.unsplash.com/photo-1781079974741-0635e52ef4c3?w=400&h=150&fit=crop" alt="explore" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#23351F]/90 via-[#23351F]/40 to-transparent" />
        <div className="absolute left-5 top-5">
          <p className="text-[#CAE5B1] text-xs font-semibold uppercase tracking-wider">Featured UNESCO Collection</p>
          <h3 className="text-white text-base font-black font-display">Sacred Asian Temples</h3>
          <div className="mt-2">
            <Badge label="32 UNESCO Sites" color="gold" />
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide mb-5">
        {filters.map(f => <Chip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />)}
      </div>
      {/* Grid */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-6">
        {sites.map(s => (
          <motion.button key={s.name} whileTap={{ scale: 0.97 }} onClick={() => { onSelectSite(s.name); onNav("details"); }}
            className="bg-white rounded-3xl overflow-hidden border border-[#E4E7EB] text-left shadow-xs hover:shadow-md transition-all group">
            <div className="h-28 bg-[#EEF1F3] relative">
              <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md rounded-full px-2 py-0.5">
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

function SearchScreen({ onBack, onSelectSite, onNav }: { onBack: () => void; onSelectSite: (name: string) => void; onNav: (s: Screen) => void }) {
  const [query, setQuery] = useState("");
  const trending = ["Bindhyabasini Temple", "Lumbini", "Patan Durbar Square"];
  const [allSites, setAllSites] = useState<HeritageSite[]>([]);

  useEffect(() => {
    getHeritageSites()
      .then(data => setAllSites(data))
      .catch(() => setAllSites([]));
  }, []);

  const results = query
    ? allSites
        .filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.location.toLowerCase().includes(query.toLowerCase()))
        .map(s => ({ name: s.name, loc: s.location, type: s.tags?.[0]?.replace(/_/g, ' ') || 'Heritage', img: getSiteImage(s.name) }))
    : [];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      <div className="px-5 pt-12 sm:pt-14 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#E4E7EB] rounded-2xl px-4 py-3 shadow-xs focus-within:border-[#69A20D]">
            <Search size={16} className="text-[#69A20D]" />
            <input autoFocus className="flex-1 text-sm text-[#222E1C] placeholder-[#A7B1A7] bg-transparent outline-none font-medium"
              placeholder="Search sites, stories, cities..." value={query} onChange={e => setQuery(e.target.value)} />
            {query && <button onClick={() => setQuery("")}><X size={14} className="text-[#5F6B5E]" /></button>}
          </div>
        </div>
        {!query ? (
          <>
            <h3 className="text-[#222E1C] text-sm font-black mb-3 font-display">Trending Searches</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {trending.map(t => (
                <button key={t} onClick={() => setQuery(t)}
                  className="flex items-center gap-1.5 bg-white border border-[#E4E7EB] rounded-full px-3.5 py-2 text-xs font-bold text-[#5F6B5E] hover:border-[#69A20D]">
                  <Search size={10} className="text-[#69A20D]" />{t}
                </button>
              ))}
            </div>
            <h3 className="text-[#222E1C] text-sm font-black mb-3 font-display">Popular Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Temples & Shrines", count: "234", color: "#23351F", bg: "#EAF6DD" },
                { label: "Ancient Ruins", count: "189", color: "#69A20D", bg: "#CAE5B1/50" },
                { label: "Palaces & Forts", count: "156", color: "#23351F", bg: "#EEF1F3" },
                { label: "Sacred Monuments", count: "87", color: "#5F6B5E", bg: "#F7F9F6" },
              ].map(c => (
                <button key={c.label} className="bg-white rounded-2xl p-4 border border-[#E4E7EB] text-left shadow-xs hover:border-[#69A20D]/40 transition-all">
                  <div className="w-8 h-8 rounded-xl mb-2 flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                    <MapPin size={14} style={{ color: c.color }} />
                  </div>
                  <p className="text-[#222E1C] text-xs font-black">{c.label}</p>
                  <p className="text-[#5F6B5E] text-[10px] mt-0.5 font-medium">{c.count} sites</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-[#5F6B5E] text-xs mb-4 font-semibold">Results for &quot;{query}&quot;</p>
            <div className="flex flex-col gap-3">
              {results.map(r => (
                <button key={r.name} onClick={() => { onSelectSite(r.name); onNav("details"); }} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#E4E7EB] shadow-xs hover:shadow-sm transition-all w-full text-left">
                  <img src={r.img} alt={r.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-[#222E1C] text-sm font-bold">{r.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      <Badge label={r.loc} color="sand" />
                      <Badge label={r.type} color="gold" />
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#5F6B5E]" />
                </button>
              ))}
              {results.length === 0 && (
                <div className="text-center py-12">
                  <Search size={40} className="text-[#EEF1F3] mx-auto mb-3" />
                  <p className="text-[#222E1C] font-bold">No results found</p>
                  <p className="text-[#5F6B5E] text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SavedScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const saved = [
    { name: "Pashupatinath Temple", loc: "Nepal", img: "https://images.unsplash.com/photo-1761048800438-730332b87f7a?w=200&h=120&fit=crop", date: "Saved 3 days ago" },
    { name: "Boudhanath Stupa", loc: "Nepal", img: "https://images.unsplash.com/photo-1761048804017-caa6ed93b8d1?w=200&h=120&fit=crop", date: "Saved 1 week ago" },
    { name: "Bindhyabasini Temple", loc: "Pokhara, Nepal", img: "https://images.unsplash.com/photo-1783682390495-b786c1939608?w=200&h=120&fit=crop", date: "Saved 2 weeks ago" },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      <NavBar title="Saved Places" right={<button className="text-[#69A20D] text-xs font-bold">{saved.length} places</button>} />
      {saved.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
          <Bookmark size={52} className="text-[#EEF1F3] mb-4" />
          <h3 className="text-[#222E1C] font-black text-lg mb-2 font-display">Nothing saved yet</h3>
          <p className="text-[#5F6B5E] text-sm mb-6">Save heritage sites to revisit them later</p>
          <PrimaryButton label="Start Exploring" onClick={() => onNav("explore")} />
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-4 pb-6 pt-2">
          {saved.map(s => (
            <motion.button key={s.name} whileTap={{ scale: 0.98 }} onClick={() => onNav("details")}
              className="bg-white rounded-3xl overflow-hidden border border-[#E4E7EB] shadow-xs hover:shadow-md transition-all text-left group">
              <div className="h-36 bg-[#EEF1F3] relative">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#69A20D] text-white flex items-center justify-center shadow-md">
                  <Bookmark size={14} className="fill-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-[#222E1C] font-black text-base font-display">{s.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1"><MapPin size={11} className="text-[#69A20D]" /><span className="text-[#5F6B5E] text-xs font-medium">{s.loc}</span></div>
                  <span className="text-[#A7B1A7] text-[10px] font-semibold">{s.date}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
      <BottomNav active="saved" onNav={onNav} />
    </div>
  );
}

function HistoryScreen({ onBack, onNav }: { onBack: () => void; onNav: (s: Screen) => void }) {
  const visits = [
    { name: "Pashupatinath Temple", loc: "Nepal", date: "Aug 2, 2026", duration: "1h 24m", img: "https://images.unsplash.com/photo-1761048800438-730332b87f7a?w=100&h=100&fit=crop" },
    { name: "Bindhyabasini Temple", loc: "Pokhara, Nepal", date: "Jul 28, 2026", duration: "2h 05m", img: "https://images.unsplash.com/photo-1760095888026-df3eeee6f302?w=100&h=100&fit=crop" },
    { name: "Patan Durbar Square", loc: "Lalitpur, Nepal", date: "Jul 15, 2026", duration: "3h 30m", img: "https://images.unsplash.com/photo-1777846937163-3eeddb48829d?w=100&h=100&fit=crop" },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
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

function AchievementsScreen({ onBack }: { onBack: () => void }) {
  const stamps = [
    { name: "Nepal Explorer", icon: "🏔️", earned: true, date: "Aug 2026" },
    { name: "Temple Seeker", icon: "🛕", earned: true, date: "Jul 2026" },
    { name: "UNESCO Pioneer", icon: "🌍", earned: true, date: "Jun 2026" },
    { name: "Stone Whisperer", icon: "🗿", earned: false, date: null },
    { name: "Ocean Voyager", icon: "🌊", earned: false, date: null },
    { name: "Desert Walker", icon: "🏜️", earned: false, date: null },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      <NavBar title="Travel Passport" onBack={onBack} />
      {/* Passport cover */}
      <div className="mx-5 rounded-3xl p-5 mb-5 relative overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #23351F 0%, #354f2f 60%, #172514 100%)" }}>
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
      {/* Stamps grid */}
      <div className="px-5">
        <h3 className="text-[#222E1C] text-sm font-black mb-4 font-display">Passport Stamps</h3>
        <div className="grid grid-cols-3 gap-3">
          {stamps.map(s => (
            <div key={s.name} className={`rounded-2xl p-4 flex flex-col items-center gap-2 border ${s.earned ? "bg-white border-[#CAE5B1]" : "bg-[#EEF1F3] border-[#E4E7EB]"}`}>
              <div className={`text-3xl ${!s.earned ? "opacity-30 grayscale" : ""}`}>{s.icon}</div>
              <p className={`text-[10px] font-bold text-center leading-tight ${s.earned ? "text-[#222E1C]" : "text-[#A7B1A7]"}`}>{s.name}</p>
              {s.earned ? <Badge label={s.date!} color="gold" /> : <span className="text-[9px] text-[#A7B1A7] font-semibold">Locked</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const notifs = [
    { title: "New heritage site near you!", body: "Patan Durbar Square is 1.2 km away. Tap to explore.", time: "2m ago", icon: MapPin, read: false },
    { title: "Ara has a new story for you", body: "Learn about the Legend of Kumari — Nepal's Living Goddess.", time: "1h ago", icon: BookOpen, read: false },
    { title: "Achievement Unlocked!", body: 'You earned the "Nepal Explorer" passport stamp!', time: "3h ago", icon: Trophy, read: true },
    { title: "Weekly Heritage Digest", body: "Discover 5 hidden gems in Southeast Asia this week.", time: "Yesterday", icon: Bell, read: true },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
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
              <p className="text-[#A7B1A7] text-[10px] mt-1 font-semibold">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { user } = useAuth();
  const displayName = user?.name || "Explorer";
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const stats = [{ label: "Sites", val: "24" }, { label: "Stories", val: "18" }, { label: "Friends", val: "142" }];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
      <div className="px-5 pt-12 sm:pt-14 pb-5 flex items-center justify-between bg-white border-b border-[#E4E7EB]">
        <h1 className="text-xl font-black text-[#222E1C] font-display">Profile</h1>
        <button onClick={() => onNav("settings")} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
          <Settings size={16} />
        </button>
      </div>
      {/* Profile card */}
      <div className="mx-5 my-4 rounded-3xl overflow-hidden shadow-md" style={{ background: "linear-gradient(135deg, #23351F 0%, #354f2f 60%, #172514 100%)" }}>
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
      {/* Menu */}
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

function SettingsScreen({ onBack, onLogout }: { onBack: () => void; onLogout?: () => void }) {
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
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
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
          <p className="text-[#5F6B5E] text-xs font-bold uppercase tracking-wider mb-2">About</p>
          <div className="bg-white rounded-2xl border border-[#E4E7EB] overflow-hidden">
            {[{ label: "Version", val: "2.4.1" }, { label: "Privacy Policy", val: "" }, { label: "Terms of Service", val: "" }].map(item => (
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

function LanguageScreen({ onBack }: { onBack: () => void }) {
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
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
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

function OfflineScreen({ onBack }: { onBack: () => void }) {
  const packs = [
    { name: "Nepal Heritage Pack", size: "142 MB", sites: 28, downloaded: true },
    { name: "Italy Ancient Sites", size: "98 MB", sites: 19, downloaded: false },
    { name: "Peru & Machu Picchu", size: "76 MB", sites: 12, downloaded: false },
  ];
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
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

function ErrorScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col bg-[#F7F9F6] min-h-[852px]">
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

// ── Screen Map ─────────────────────────────────────────────────────────────
const SCREEN_LABELS: Record<Screen, string> = {
  splash: "Splash", onboarding: "Onboarding", login: "Login", register: "Register",
  home: "Home", camera: "Camera", scanning: "Scanning", result: "Recognition Result",
  details: "Heritage Details", story: "Story Mode", audio: "Audio Guide", map: "Nearby Map",
  explore: "Explore", search: "Search", saved: "Saved Places", history: "Visit History",
  achievements: "Achievements", notifications: "Notifications", profile: "Profile",
  settings: "Settings", language: "Language", offline: "Offline Mode", error: "Error State", empty: "Empty State",
};

const ALL_SCREENS: Screen[] = [
  "splash", "onboarding", "login", "register", "home", "camera", "scanning", "result",
  "details", "story", "audio", "map", "explore", "search", "saved", "history",
  "achievements", "notifications", "profile", "settings", "language", "offline", "error",
];

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<Screen>("splash");
  const [history, setHistory] = useState<Screen[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | undefined>();
  const { isAuthenticated } = useAuth();

  const nav = (s: Screen) => { setHistory(h => [...h, active]); setActive(s); };
  const back = () => { if (history.length > 0) { setActive(history[history.length - 1]); setHistory(h => h.slice(0, -1)); } };

  const handleSelectSite = useCallback((name: string) => {
    setSelectedSite(name);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setImageFile(file);
    setRecognitionResult(null);
    setRecognitionError(undefined);
  }, []);

  const handleRecognitionResult = useCallback((result: RecognitionResult | null, error?: string) => {
    setRecognitionResult(result);
    setRecognitionError(error);
    if (result?.siteName) {
      setSelectedSite(result.siteName);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setHistory([]);
    setActive("login");
  }, []);

  const renderScreen = () => {
    switch (active) {
      case "splash": return <SplashScreen onDone={() => nav(isAuthenticated ? "home" : "onboarding")} />;
      case "onboarding": return <OnboardingScreen onDone={() => nav("login")} />;
      case "login": return <LoginScreen onDone={() => nav("home")} onRegister={() => nav("register")} />;
      case "register": return <RegisterScreen onDone={() => nav("home")} onBack={back} />;
      case "home": return <HomeScreen onNav={nav} onScan={() => nav("camera")} onSelectSite={handleSelectSite} />;
      case "camera": return <CameraScreen onScan={() => nav("scanning")} onBack={back} onFileSelect={handleFileSelect} />;
      case "scanning": return <ScanningScreen onDone={() => nav("result")} imageFile={imageFile} onRecognitionResult={handleRecognitionResult} />;
      case "result": return <ResultScreen onNav={nav} onBack={back} recognitionResult={recognitionResult} recognitionError={recognitionError} onSelectSite={handleSelectSite} />;
      case "details": return <DetailsScreen onNav={nav} onBack={back} selectedSite={selectedSite} />;
      case "story": return <StoryScreen onBack={back} selectedSite={selectedSite} />;
      case "audio": return <AudioGuideScreen onBack={back} selectedSite={selectedSite} />;
      case "map": return <MapScreen onNav={nav} onBack={back} />;
      case "explore": return <ExploreScreen onNav={nav} onSelectSite={handleSelectSite} />;
      case "search": return <SearchScreen onBack={back} onSelectSite={handleSelectSite} onNav={nav} />;
      case "saved": return <SavedScreen onNav={nav} />;
      case "history": return <HistoryScreen onBack={back} onNav={nav} />;
      case "achievements": return <AchievementsScreen onBack={back} />;
      case "notifications": return <NotificationsScreen onBack={back} />;
      case "profile": return <ProfileScreen onNav={nav} />;
      case "settings": return <SettingsScreen onBack={back} onLogout={handleLogout} />;
      case "language": return <LanguageScreen onBack={back} />;
      case "offline": return <OfflineScreen onBack={back} />;
      case "error": return <ErrorScreen onBack={back} />;
      default: return <ErrorScreen onBack={back} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] sm:bg-gradient-to-br sm:from-[#1a2a6c] sm:via-[#2C3E8F] sm:to-[#0d1b4a] flex flex-col items-center justify-center p-0 sm:p-4 md:p-6">
      <PhoneFrame>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }} className="min-h-full flex flex-col">
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </PhoneFrame>
    </div>
  );
}
