import React from "react";

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full min-h-screen sm:min-h-[840px] sm:h-[852px] sm:max-w-md md:max-w-lg lg:max-w-xl bg-[#FFFFFF] overflow-hidden sm:rounded-[36px] sm:shadow-[0_12px_48px_rgba(35,53,31,0.12)] sm:border sm:border-[#E4E7EB] flex-shrink-0 transition-all duration-300">
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

