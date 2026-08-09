import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Navigation, Loader2, Star, MapPin, Volume2, Info } from "lucide-react";
import type { Screen } from "../../types/screen";
import { getSiteImage } from "../../constants/siteImages";

export function MapScreen({ onNav, onBack, onSelectSite }: { onNav: (s: Screen) => void; onBack: () => void; onSelectSite?: (name: string) => void }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routePolylineRef = useRef<any>(null);

  type PlaceCategory = 'Temple' | 'Buddhist' | 'UNESCO' | 'Palace' | 'Park';

  const heritagePlaces: {
    name: string; location: string; lat: number; lng: number;
    rating: number; category: PlaceCategory; hours: string;
    fee: string; bestTime: string; tips: number; mustSee: string;
    emoji: string;
  }[] = [
    { name: "Patan Durbar Square", location: "Lalitpur, Nepal", lat: 27.6727, lng: 85.3253, rating: 4.8, category: "UNESCO", hours: "Open 24h", fee: "NPR 1,000", bestTime: "Morning", tips: 342, mustSee: "Krishna Mandir", emoji: "🏛️" },
    { name: "Bindhyabasini Temple", location: "Pokhara, Nepal", lat: 28.2380, lng: 83.9856, rating: 4.9, category: "Temple", hours: "5am–9pm", fee: "Free", bestTime: "Sunrise", tips: 218, mustSee: "Hilltop View", emoji: "⛩️" },
    { name: "Lumbini", location: "Rupandehi, Nepal", lat: 27.4840, lng: 83.2760, rating: 4.9, category: "Buddhist", hours: "Sunrise–Sunset", fee: "NPR 300", bestTime: "Early Morning", tips: 476, mustSee: "Maya Devi Temple", emoji: "☸️" },
    { name: "Pashupatinath Temple", location: "Kathmandu, Nepal", lat: 27.7104, lng: 85.3487, rating: 4.9, category: "UNESCO", hours: "4am–9pm", fee: "NPR 1,000", bestTime: "Aarti 6pm", tips: 589, mustSee: "Evening Aarti", emoji: "🕉️" },
    { name: "Boudhanath Stupa", location: "Kathmandu Valley", lat: 27.7215, lng: 85.3620, rating: 4.8, category: "Buddhist", hours: "Open 24h", fee: "NPR 400", bestTime: "Golden Hour", tips: 412, mustSee: "Kora Walk", emoji: "☮️" },
    { name: "Swayambhunath", location: "Kathmandu, Nepal", lat: 27.7149, lng: 85.2904, rating: 4.7, category: "Buddhist", hours: "Open 24h", fee: "NPR 200", bestTime: "Sunrise", tips: 301, mustSee: "Monkey Temple", emoji: "🐒" },
    { name: "Bhaktapur Durbar Square", location: "Bhaktapur, Nepal", lat: 27.6710, lng: 85.4298, rating: 4.8, category: "UNESCO", hours: "7am–7pm", fee: "NPR 1,500", bestTime: "Afternoon", tips: 267, mustSee: "55-Window Palace", emoji: "🏯" },
    { name: "Changu Narayan Temple", location: "Bhaktapur, Nepal", lat: 27.7129, lng: 85.4228, rating: 4.6, category: "Temple", hours: "6am–7pm", fee: "NPR 300", bestTime: "Morning", tips: 143, mustSee: "Ancient Carvings", emoji: "🛕" },
    { name: "Chitwan National Park", location: "Chitwan, Nepal", lat: 27.5291, lng: 84.3542, rating: 4.9, category: "Park", hours: "Dawn–Dusk", fee: "NPR 2,500", bestTime: "Early Morning", tips: 534, mustSee: "Rhino Safari", emoji: "🦏" },
  ];

  const categories = ['All', 'Temple', 'Buddhist', 'UNESCO', 'Palace', 'Park'] as const;
  type FilterCat = typeof categories[number];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterCat>('All');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 27.7172, lng: 85.3240 });
  const [locating, setLocating] = useState(false);
  const [showRouteLine, setShowRouteLine] = useState(false);

  const filteredPlaces = activeFilter === 'All'
    ? heritagePlaces
    : heritagePlaces.filter(p => p.category === activeFilter);

  const categoryColors: Record<string, string> = {
    Temple: '#B45309', Buddhist: '#6D28D9', UNESCO: '#069', Palace: '#92400E', Park: '#166534',
  };
  const categoryBg: Record<string, string> = {
    Temple: '#FEF3C7', Buddhist: '#EDE9FE', UNESCO: '#DBEAFE', Palace: '#FEF3C7', Park: '#DCFCE7',
  };

  const calcDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) * 10) / 10;
  };

  const selectedPlace = heritagePlaces[selectedIdx];
  const distanceKm = calcDistanceKm(userLocation.lat, userLocation.lng, selectedPlace.lat, selectedPlace.lng);
  const distanceMiles = (distanceKm * 0.621371).toFixed(1);
  const drivingMins = Math.max(5, Math.round((distanceKm / 22) * 60));
  const walkingHours = (distanceKm / 4.5);
  const walkingTimeText = walkingHours < 1
    ? `${Math.round(walkingHours * 60)} mins`
    : `${Math.floor(walkingHours)}h ${Math.round((walkingHours % 1) * 60)}m`;

  useEffect(() => {
    let map: any = null;
    async function initLeafletMap() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false })
        .setView([27.7215, 85.3620], 10);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersRef.current = [];
      heritagePlaces.forEach((place) => {
        const col = categoryColors[place.category] || '#23351F';
        const customIcon = L.divIcon({
          className: '',
          html: `<div style="background:${col};color:white;border:2.5px solid white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 16px rgba(0,0,0,0.3);cursor:pointer;">${place.emoji}</div>`,
          iconSize: [36, 36], iconAnchor: [18, 36],
        });
        const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
        marker.bindTooltip(`<b>${place.name}</b><br/>${place.fee} · ${place.hours}`, { direction: 'top', offset: [0, -36] });
        marker.on('click', () => {
          const realIdx = heritagePlaces.findIndex(p => p.name === place.name);
          setSelectedIdx(realIdx);
          map.flyTo([place.lat, place.lng], 15, { duration: 1.2 });
        });
        markersRef.current.push(marker);
      });

      const userIcon = L.divIcon({
        className: '',
        html: `<div style="width:22px;height:22px;background:#3B82F6;border:3.5px solid white;border-radius:50%;box-shadow:0 0 0 7px rgba(59,130,246,0.35);"></div>`,
        iconSize: [22, 22], iconAnchor: [11, 11],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindTooltip('📍 Your Location', { permanent: false });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setUserLocation({ lat, lng });
        }, () => {}, { timeout: 8000 });
      }

      mapInstanceRef.current = map;
      setMapLoaded(true);
    }
    initLeafletMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  const updateRouteLine = async (targetPlace: typeof heritagePlaces[0], userPos: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current) return;
    const L = (await import('leaflet')).default;

    if (routePolylineRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    const latlngs = [
      [userPos.lat, userPos.lng],
      [targetPlace.lat, targetPlace.lng]
    ];

    const dist = calcDistanceKm(userPos.lat, userPos.lng, targetPlace.lat, targetPlace.lng);

    const polyline = L.polyline(latlngs, {
      color: '#69A20D',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.9
    }).addTo(mapInstanceRef.current);

    polyline.bindTooltip(`Distance: <b>${dist} km</b>`, { permanent: true, direction: 'center' });
    routePolylineRef.current = polyline;

    mapInstanceRef.current.fitBounds(L.latLngBounds(latlngs), { padding: [45, 45], maxZoom: 15, animate: true });
  };

  const handleSelectPlace = (realIdx: number) => {
    setSelectedIdx(realIdx);
    const place = heritagePlaces[realIdx];
    if (mapInstanceRef.current) {
      if (showRouteLine) {
        updateRouteLine(place, userLocation);
      } else {
        mapInstanceRef.current.flyTo([place.lat, place.lng], 15, { duration: 1.2 });
      }
    }
  };

  const handleToggleRoute = () => {
    const nextState = !showRouteLine;
    setShowRouteLine(nextState);
    if (nextState) {
      updateRouteLine(selectedPlace, userLocation);
    } else if (routePolylineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
      mapInstanceRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 15, { duration: 1.2 });
    }
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocating(false);
      const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setUserLocation(newLoc);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([newLoc.lat, newLoc.lng], 14, { duration: 1.5 });
      }
    }, () => setLocating(false), { timeout: 8000 });
  };

  const handleDirections = (place: typeof heritagePlaces[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col bg-[#F7F9F6] h-full min-h-full flex-1 relative overflow-hidden">
      <div className="px-5 pt-12 sm:pt-14 pb-3 flex items-center gap-3 bg-white/95 backdrop-blur-md border-b border-[#E4E7EB] z-20 shadow-xs">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center text-[#222E1C]">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <span className="text-[#222E1C] text-base font-black font-display block leading-tight">Interactive Map & Distance</span>
          <span className="text-[#5F6B5E] text-[10px] font-medium">{heritagePlaces.length} real locations</span>
        </div>
        <button onClick={handleNearMe} disabled={locating}
          className="flex items-center gap-1.5 bg-[#EAF6DD] text-[#23351F] border border-[#CAE5B1] text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
          {locating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} className="text-[#69A20D]" />}
          <span>{locating ? 'Locating...' : 'Near Me'}</span>
        </button>
      </div>

      <div className="px-5 py-2.5 bg-white border-b border-[#E4E7EB] flex gap-2 overflow-x-auto scrollbar-hide z-10">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)}
            className={`flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
              activeFilter === cat
                ? 'bg-[#23351F] text-white border-[#23351F]'
                : 'bg-[#EEF1F3] text-[#5F6B5E] border-[#E4E7EB] hover:border-[#69A20D]'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 relative w-full h-full min-h-[380px] z-0">
        <div ref={mapContainerRef} className="w-full h-full inset-0 absolute" />
        {!mapLoaded && (
          <div className="absolute inset-0 bg-[#EEF1F3] flex items-center justify-center gap-2 text-sm text-[#23351F] font-bold z-10">
            <Loader2 size={18} className="animate-spin text-[#69A20D]" />
            <span>Loading OpenStreetMap...</span>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 z-10 overflow-x-auto scrollbar-hide flex gap-2 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 shadow-md">
          {filteredPlaces.map(p => {
            const realIdx = heritagePlaces.findIndex(h => h.name === p.name);
            const isSel = selectedIdx === realIdx;
            const dist = calcDistanceKm(userLocation.lat, userLocation.lng, p.lat, p.lng);
            return (
              <button
                key={p.name}
                onClick={() => handleSelectPlace(realIdx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                  isSel
                    ? 'bg-[#23351F] text-white shadow-sm'
                    : 'bg-white/80 text-[#222E1C] hover:bg-[#EAF6DD] border border-[#E4E7EB]'
                }`}
              >
                <span>{p.emoji}</span>
                <span>{p.name.split(' ')[0]}</span>
                <span className={`text-[10px] ${isSel ? 'text-[#CAE5B1]' : 'text-[#69A20D]'}`}>({dist} km)</span>
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-3 bg-white/95 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/80 shadow-md z-10">
          <p className="text-[#222E1C] text-[9px] font-black mb-1">LEGEND</p>
          {(['Temple','Buddhist','UNESCO','Park'] as PlaceCategory[]).map(cat => (
            <div key={cat} className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
              <span className="text-[9px] text-[#5F6B5E] font-medium">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 bg-[#F7F9F6] border-t border-[#E4E7EB] z-20">
        <motion.div key={selectedPlace.name} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl border border-[#E4E7EB] shadow-md overflow-hidden">
          
          <div className="flex items-start gap-3 p-3.5 pb-2">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF1F3] overflow-hidden flex-shrink-0">
              <img src={getSiteImage(selectedPlace.name)} alt={selectedPlace.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                <p className="text-[#222E1C] font-black text-sm">{selectedPlace.name}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                  style={{ color: categoryColors[selectedPlace.category], backgroundColor: categoryBg[selectedPlace.category] }}>
                  {selectedPlace.category}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-[#222E1C]">{selectedPlace.rating}</span>
                </div>
                <span className="text-[#94A3B8] text-xs">·</span>
                <MapPin size={9} className="text-[#69A20D]" />
                <span className="text-[#5F6B5E] text-[10px] font-medium truncate">{selectedPlace.location}</span>
              </div>
            </div>
          </div>

          <div className="mx-3.5 mb-2.5 bg-[#EAF6DD] rounded-2xl p-2.5 border border-[#CAE5B1]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase text-[#23351F] tracking-wider flex items-center gap-1">
                <Navigation size={11} className="text-[#69A20D]" /> Real GPS Distance Calculator
              </span>
              <button onClick={handleToggleRoute}
                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                  showRouteLine
                    ? 'bg-[#23351F] text-white border-[#23351F]'
                    : 'bg-white text-[#23351F] border-[#CAE5B1]'
                }`}>
                {showRouteLine ? '✓ Route Line Active' : '📍 Show Route Line'}
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-xl py-1.5 px-1 border border-[#CAE5B1]">
                <p className="text-[#69A20D] text-[8px] font-black uppercase">Direct Distance</p>
                <p className="text-[#222E1C] text-xs font-black mt-0.5">{distanceKm} km</p>
                <p className="text-[#5F6B5E] text-[8px] font-medium">{distanceMiles} mi</p>
              </div>

              <div className="bg-[#FFFFFF] rounded-xl py-1.5 px-1 border border-[#CAE5B1]">
                <p className="text-[#69A20D] text-[8px] font-black uppercase">Driving 🚗</p>
                <p className="text-[#222E1C] text-xs font-black mt-0.5">~{drivingMins} mins</p>
                <p className="text-[#5F6B5E] text-[8px] font-medium">Estimated Drive</p>
              </div>

              <div className="bg-[#FFFFFF] rounded-xl py-1.5 px-1 border border-[#CAE5B1]">
                <p className="text-[#69A20D] text-[8px] font-black uppercase">Walking 🚶</p>
                <p className="text-[#222E1C] text-xs font-black mt-0.5">{walkingTimeText}</p>
                <p className="text-[#5F6B5E] text-[8px] font-medium">Foot Pace</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 px-3.5 pb-3">
            <button onClick={() => handleDirections(selectedPlace)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#23351F] text-white text-xs font-bold py-2.5 rounded-2xl shadow-sm">
              <Navigation size={12} />
              Open Google Maps
            </button>
            <button onClick={() => { onSelectSite?.(selectedPlace.name); onNav("audio"); }}

              className="flex-1 flex items-center justify-center gap-1.5 bg-[#EAF6DD] text-[#23351F] text-xs font-bold py-2.5 rounded-2xl border border-[#CAE5B1]">
              <Volume2 size={12} className="text-[#69A20D]" />
              Audio Guide
            </button>
            <button onClick={() => { onSelectSite?.(selectedPlace.name); onNav("details"); }}
              className="w-10 flex items-center justify-center bg-[#EEF1F3] text-[#222E1C] rounded-2xl border border-[#E4E7EB]">
              <Info size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
