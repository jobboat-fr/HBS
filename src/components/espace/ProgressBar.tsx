export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-teal-gradient transition-all" style={{ width: `${v}%` }} />
      </div>
      <div className="mt-1 text-xs font-medium text-ink-muted">{v}% complété</div>
    </div>
  );
}
