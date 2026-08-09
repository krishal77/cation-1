import React from "react";

export function InputField({ placeholder, type = "text", icon, value, onChange }: { placeholder: string; type?: string; icon?: React.ReactNode; value?: string; onChange?: (v: string) => void }) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6B5E]">{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full bg-[#EEF1F3] border border-[#E4E7EB] focus:border-[#69A20D] focus:bg-white rounded-2xl py-3.5 text-sm text-[#222E1C] placeholder-[#94A3B8] outline-none transition-all duration-200 ${icon ? "pl-12 pr-4" : "px-4"}`}
      />
    </div>
  );
}
