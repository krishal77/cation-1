export interface OnboardingSlide {
  img: string;
  title: string;
  body: string;
  badge: string;
}

export const ONBOARDING: OnboardingSlide[] = [
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
