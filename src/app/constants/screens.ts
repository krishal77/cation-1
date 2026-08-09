import type { Screen } from "../types/screen";

export const SCREEN_LABELS: Record<Screen, string> = {
  splash: "Splash Screen",
  onboarding: "Onboarding Flow",
  login: "Log In",
  register: "Register",
  home: "Home Dashboard",
  camera: "Scanner Camera",
  scanning: "AI Recognition",
  result: "Site Details Result",
  details: "Full Site Information",
  story: "AI Cultural Story",
  audio: "Audio Guide Player",
  map: "Interactive Map",
  explore: "Explore Directory",
  search: "Search Sites",
  saved: "Saved Sites",
  history: "Scan History",
  achievements: "Passport & Badges",
  notifications: "Notifications",
  profile: "User Profile",
  settings: "App Settings",
  language: "Language Options",
  offline: "Offline Mode",
  error: "Error State",
  empty: "Empty State",
};

export const ALL_SCREENS: Screen[] = [
  "splash", "onboarding", "login", "register", "home", "camera", "scanning",
  "result", "details", "story", "audio", "map", "explore", "search", "saved", "history",
  "achievements", "notifications", "profile", "settings", "language", "offline", "error",
];
