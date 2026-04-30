export default function ProductCardSkeleton({ dark = false }) {
  const base = dark ? 'bg-white/10' : 'bg-gray-200';
  const pulse = 'animate-pulse';

  return (
    <div className="rounded-xl overflow-hidden">
      <div className={`aspect-square ${base} ${pulse}`} />
      <div className={`p-4 ${dark ? 'bg-white/5' : 'bg-white'}`}>
        <div className={`h-3 w-16 rounded ${base} ${pulse} mb-2`} />
        <div className={`h-4 w-full rounded ${base} ${pulse} mb-3`} />
        <div className={`h-5 w-24 rounded ${base} ${pulse}`} />
      </div>
    </div>
  );
}
