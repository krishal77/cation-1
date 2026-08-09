import { motion } from "motion/react";

export function MascotSVG({ size = 80, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 120 120" fill="none"
      animate={animate ? { y: [0, -6, 0] } : {}}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="60" cy="60" r="52" fill="url(#aura)" opacity="0.3" />
      <ellipse cx="60" cy="72" rx="22" ry="14" fill="#23351F" opacity="0.15" />
      <path d="M38 58 Q60 32 82 58 Q78 80 60 84 Q42 80 38 58Z" fill="url(#bodyGrad)" />
      <path d="M46 64 Q60 70 74 64 Q72 78 60 82 Q48 78 46 64Z" fill="#172514" opacity="0.25" />
      <circle cx="60" cy="48" r="18" fill="url(#headGrad)" />
      <ellipse cx="54" cy="47" rx="3.5" ry="4" fill="white" />
      <ellipse cx="66" cy="47" rx="3.5" ry="4" fill="white" />
      <circle cx="54.5" cy="47.5" r="2" fill="#222E1C" />
      <circle cx="66.5" cy="47.5" r="2" fill="#222E1C" />
      <circle cx="55.5" cy="46.5" r="0.8" fill="white" />
      <circle cx="67.5" cy="46.5" r="0.8" fill="white" />
      <path d="M54 55 Q60 60 66 55" stroke="#222E1C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="53" r="3" fill="#69A20D" opacity="0.35" />
      <circle cx="70" cy="53" r="3" fill="#69A20D" opacity="0.35" />
      <path d="M44 38 L48 28 L52 35 L56 22 L60 32 L64 22 L68 35 L72 28 L76 38" stroke="#69A20D" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="60" cy="22" r="3" fill="#69A20D" />
      <path d="M34 60 Q26 52 32 42 Q36 36 42 44" stroke="#69A20D" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.5" />
      <path d="M86 60 Q94 52 88 42 Q84 36 78 44" stroke="#69A20D" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="28" cy="38" r="2" fill="#69A20D" opacity="0.8" />
      <circle cx="92" cy="38" r="2" fill="#69A20D" opacity="0.8" />
      <circle cx="32" cy="76" r="1.5" fill="#23351F" opacity="0.4" />
      <circle cx="88" cy="76" r="1.5" fill="#23351F" opacity="0.4" />
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

