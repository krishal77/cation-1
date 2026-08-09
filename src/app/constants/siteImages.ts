export const SITE_IMAGES: Record<string, string> = {
  "Bindhyabasini Temple": "https://images.unsplash.com/photo-1761048800438-730332b87f7a?w=400&h=250&fit=crop",
  "Lumbini": "https://images.unsplash.com/photo-1761048804017-caa6ed93b8d1?w=400&h=250&fit=crop",
  "Patan Durbar Square": "https://images.unsplash.com/photo-1779209344034-23d80393eaa8?w=400&h=250&fit=crop",
  "Pashupatinath Temple": "https://images.unsplash.com/photo-1761048803183-fc870f25e221?w=400&h=250&fit=crop",
  "Boudhanath Stupa": "https://images.unsplash.com/photo-1761048804017-caa6ed93b8d1?w=400&h=250&fit=crop",
};

export const DEFAULT_SITE_IMG = "https://images.unsplash.com/photo-1783682390495-b786c1939608?w=400&h=250&fit=crop";

export function getSiteImage(name: string): string {
  return SITE_IMAGES[name] || DEFAULT_SITE_IMG;
}
