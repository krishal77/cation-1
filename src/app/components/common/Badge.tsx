export function Badge({ label, color = "gold" }: { label: string; color?: "gold" | "indigo" | "green" | "sand" }) {
  const styles: Record<string, string> = {
    gold: "bg-[#CAE5B1]/60 text-[#23351F] border border-[#69A20D]/30",
    indigo: "bg-[#EAF6DD] text-[#23351F] border border-[#CAE5B1]",
    green: "bg-[#69A20D]/15 text-[#23351F] border border-[#69A20D]/40",
    sand: "bg-[#EEF1F3] text-[#5F6B5E] border border-[#E4E7EB]",
  };
  return <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${styles[color]}`}>{label}</span>;
}
