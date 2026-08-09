import { useState, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import type { RecognitionResult } from "./services/api";
import type { Screen } from "./types/screen";
import { SCREEN_LABELS, ALL_SCREENS } from "./constants/screens";
import { PhoneFrame } from "./components/common/PhoneFrame";

import { SplashScreen } from "./screens/auth/SplashScreen";

import { OnboardingScreen } from "./screens/auth/OnboardingScreen";
import { LoginScreen } from "./screens/auth/LoginScreen";
import { RegisterScreen } from "./screens/auth/RegisterScreen";
import { HomeScreen } from "./screens/home/HomeScreen";
import { CameraScreen } from "./screens/scan/CameraScreen";
import { ScanningScreen } from "./screens/scan/ScanningScreen";
import { ResultScreen } from "./screens/scan/ResultScreen";
import { DetailsScreen } from "./screens/site/DetailsScreen";
import { StoryScreen } from "./screens/site/StoryScreen";
import { AudioGuideScreen } from "./screens/site/AudioGuideScreen";
import { MapScreen } from "./screens/explore/MapScreen";
import { ExploreScreen } from "./screens/explore/ExploreScreen";
import { SearchScreen } from "./screens/explore/SearchScreen";
import { SavedScreen } from "./screens/user/SavedScreen";
import { HistoryScreen } from "./screens/user/HistoryScreen";
import { AchievementsScreen } from "./screens/user/AchievementsScreen";
import { NotificationsScreen } from "./screens/user/NotificationsScreen";
import { ProfileScreen } from "./screens/user/ProfileScreen";
import { SettingsScreen } from "./screens/user/SettingsScreen";
import { LanguageScreen } from "./screens/user/LanguageScreen";
import { OfflineScreen } from "./screens/system/OfflineScreen";
import { ErrorScreen } from "./screens/system/ErrorScreen";

export default function App() {
  const [active, setActive] = useState<Screen>("splash");
  const [history, setHistory] = useState<Screen[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | undefined>();
  const { isAuthenticated: _isAuthenticated } = useAuth();

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
      case "splash": return <SplashScreen onDone={() => nav("home")} />;
      case "onboarding": return <OnboardingScreen onDone={() => nav("home")} />;
      case "login": return <LoginScreen onDone={() => nav("home")} onRegister={() => nav("register")} />;
      case "register": return <RegisterScreen onDone={() => nav("home")} onBack={back} />;
      case "home": return <HomeScreen onNav={nav} onScan={() => nav("camera")} onSelectSite={handleSelectSite} />;
      case "camera": return <CameraScreen onScan={() => nav("scanning")} onBack={back} onFileSelect={handleFileSelect} />;
      case "scanning": return <ScanningScreen onDone={() => nav("result")} imageFile={imageFile} onRecognitionResult={handleRecognitionResult} />;
      case "result": return <ResultScreen onNav={nav} onBack={back} recognitionResult={recognitionResult} recognitionError={recognitionError} onSelectSite={handleSelectSite} />;
      case "details": return <DetailsScreen onNav={nav} onBack={back} selectedSite={selectedSite} />;
      case "story": return <StoryScreen onBack={back} selectedSite={selectedSite} onNav={nav} />;
      case "audio": return <AudioGuideScreen onBack={back} selectedSite={selectedSite} />;
      case "map": return <MapScreen onNav={nav} onBack={back} onSelectSite={handleSelectSite} />;
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
      default: return <HomeScreen onNav={nav} onScan={() => nav("camera")} onSelectSite={handleSelectSite} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#111A10] flex flex-col items-center justify-center font-sans antialiased text-[#222E1C] selection:bg-[#CAE5B1] selection:text-[#23351F]">
      <PhoneFrame>
        {renderScreen()}
      </PhoneFrame>

      <div className="hidden lg:flex fixed bottom-3 right-3 bg-white/90 backdrop-blur-xl border border-[#E4E7EB] rounded-2xl p-2 z-50 shadow-xl max-w-md flex-wrap gap-1 items-center">

        <span className="text-[10px] font-black text-[#23351F] uppercase tracking-wider px-2">Dev Screen:</span>
        <select
          value={active}
          onChange={e => nav(e.target.value as Screen)}
          className="text-xs bg-[#EEF1F3] border border-[#E4E7EB] font-bold text-[#222E1C] rounded-lg px-2 py-1 outline-none"
        >
          {ALL_SCREENS.map(s => (
            <option key={s} value={s}>{SCREEN_LABELS[s] || s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
