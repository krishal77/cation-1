import { motion } from "motion/react";
import { Star, MapPin } from "lucide-react";
import { Badge } from "./Badge";

export function HeritageCard({ name, location, img, rating, onClick }: {
  name: string; location: string; img: string; rating: number; onClick?: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(35,53,31,0.03)] hover:shadow-[0_8px_30px_rgba(35,53,31,0.06)] border border-[#E4E7EB] flex-shrink-0 w-52 text-left transition-all duration-300 group"
    >
      <div className="relative h-32 bg-[#EEF1F3]">
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-2.5 right-2.5">
          <Badge label="UNESCO" color="gold" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/60 shadow-xs">
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
