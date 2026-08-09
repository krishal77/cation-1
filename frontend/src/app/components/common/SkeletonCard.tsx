export function SkeletonCard() {
  return (
    <div className="bg-white/90 rounded-3xl p-4 animate-pulse border border-[#E4E7EB]">
      <div className="h-32 bg-[#EEF1F3] rounded-2xl mb-3" />
      <div className="h-4 bg-[#EEF1F3] rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-[#EEF1F3] rounded-full w-1/2" />
    </div>
  );
}
