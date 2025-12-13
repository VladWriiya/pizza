interface StatusBarProps {
  label: string;
  count: number;
  color: string;
  maxCount: number;
}

export function StatusBar({ label, count, color, maxCount }: StatusBarProps) {
  const percentage = maxCount > 0 ? Math.min((count / maxCount) * 100, 100) : 0;

  return (
    <div className="pz-flex pz-items-center pz-gap-3">
      <span className="pz-w-24 pz-text-sm pz-text-gray-600 pz-truncate">{label}</span>
      <div className="pz-flex-1 pz-h-6 pz-bg-gray-100 pz-rounded-full pz-overflow-hidden">
        <div
          className={`pz-h-full pz-rounded-full pz-transition-all pz-duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="pz-w-8 pz-text-sm pz-font-semibold pz-text-end">{count}</span>
    </div>
  );
}
