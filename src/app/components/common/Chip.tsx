export function Chip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${active ? "bg-[#23351F] text-white shadow-sm border border-[#23351F]" : "bg-[#EEF1F3] text-[#5F6B5E] border border-[#E4E7EB] hover:bg-[#EAF6DD] hover:text-[#222E1C]"}`}>
      {label}
    </button>
  );
}
